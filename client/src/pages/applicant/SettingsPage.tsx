import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Lock,
  Eye,
  Globe,
  Save,
  LogOut,
  Sun,
  Moon,
  Loader2,
  CheckCircle,
  User,
  Shield,
  Palette,
  Zap,
  Smartphone,
  Mail,
  BellRing,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import api from "@/services/api";
import { applicantService } from "@/services/applicantService";
import { notificationService } from "@/services/notificationService";
import { SettingsPageSkeleton } from "@/components/ui/page-skeletons";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function SettingsPage() {
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState({
    // Notification preferences (synced with backend)
    emailNotifications: true,
    applicationUpdates: true,
    jobAlerts: true,
    pushNotifications: false,
    smsNotifications: false,
    promotionalEmails: false,

    // Auto-apply (synced with backend)
    autoApplyToMatching: false,

    // Privacy
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,

    // Appearance
    theme: "system",
    language: "en",

    // Account
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [autoApplyResult, setAutoApplyResult] = useState<string | null>(null);
  const [pushPermission, setPushPermission] = useState<string>(notificationService.permission);

  // Load settings from backend + local storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [backendSettings, savedTheme, savedLocalPrefs] = await Promise.all([
          applicantService.getSettings(),
          Promise.resolve(localStorage.getItem("theme") || "system"),
          Promise.resolve(JSON.parse(localStorage.getItem("legaforce_settings") || "{}")),
        ]);

        setSettings((s) => ({
          ...s,
          // Backend-synced settings
          autoApplyToMatching: backendSettings.autoApplyToMatching ?? false,
          pushNotifications: backendSettings.pushNotifications ?? false,
          smsNotifications: backendSettings.smsNotifications ?? false,
          emailNotifications: backendSettings.emailNotifications ?? true,
          jobAlerts: backendSettings.jobAlerts ?? true,
          applicationUpdates: backendSettings.applicationUpdates ?? true,
          // Local settings
          theme: savedTheme,
          profileVisibility: savedLocalPrefs.profileVisibility || "public",
          showEmail: savedLocalPrefs.showEmail ?? false,
          showPhone: savedLocalPrefs.showPhone ?? false,
          language: savedLocalPrefs.language || "en",
          promotionalEmails: savedLocalPrefs.promotionalEmails ?? false,
        }));
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
    setPushPermission(notificationService.permission);
  }, []);

  const handleToggle = (key: string) => {
    setSettings((s) => ({ ...s, [key]: !(s as any)[key] }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings((s) => ({ ...s, [key]: value }));

    if (key === "theme") {
      localStorage.setItem("theme", value);
      const root = document.documentElement;
      if (value === "dark") {
        root.classList.add("dark");
      } else if (value === "light") {
        root.classList.remove("dark");
      } else {
        // System preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      }
      toast.success("Theme updated!");
    }
  };

  // ── Auto-Apply Toggle ──────────────────────────
  const handleAutoApplyToggle = async () => {
    const newVal = !settings.autoApplyToMatching;
    setSettings((s) => ({ ...s, autoApplyToMatching: newVal }));

    try {
      const result = await applicantService.setAutoApply(newVal);
      const msg = result?.message || (newVal ? "Auto-apply enabled" : "Auto-apply disabled");
      toast.success(msg);
      setAutoApplyResult(msg);

      // Trigger push notification if auto-applied to jobs
      if (result?.autoAppliedCount > 0) {
        await notificationService.notifyAutoApply(result.autoAppliedCount);
      }

      // Clear message after 5s
      setTimeout(() => setAutoApplyResult(null), 5000);
    } catch (error: any) {
      setSettings((s) => ({ ...s, autoApplyToMatching: !newVal }));
      toast.error(error.response?.data?.message || "Failed to update auto-apply");
    }
  };

  // ── Push Notification Toggle ───────────────────
  const handlePushToggle = async () => {
    if (!notificationService.isSupported) {
      toast.error("Push notifications are not supported in this browser");
      return;
    }

    if (!settings.pushNotifications) {
      // Enabling — request permission
      const permission = await notificationService.requestPermission();
      setPushPermission(permission);

      if (permission === "denied") {
        toast.error("Notification permission denied. Please enable it in your browser settings.");
        return;
      }
      if (permission !== "granted") {
        toast.info("Notification permission was dismissed");
        return;
      }

      // Permission granted — update backend
      setSettings((s) => ({ ...s, pushNotifications: true }));
      try {
        await applicantService.updateNotificationPrefs({ pushNotifications: true });
        toast.success("Push notifications enabled! 🔔");

        // Show a test notification
        await notificationService.notify({
          title: "Notifications Enabled! 🎉",
          body: "You will now receive push notifications for job matches and application updates.",
          url: "/app/settings",
        });
      } catch {
        setSettings((s) => ({ ...s, pushNotifications: false }));
        toast.error("Failed to save push notification preference");
      }
    } else {
      // Disabling
      setSettings((s) => ({ ...s, pushNotifications: false }));
      try {
        await applicantService.updateNotificationPrefs({ pushNotifications: false });
        toast.success("Push notifications disabled");
      } catch {
        setSettings((s) => ({ ...s, pushNotifications: true }));
        toast.error("Failed to update preference");
      }
    }
  };

  // ── SMS Toggle ─────────────────────────────────
  const handleSmsToggle = async () => {
    const newVal = !settings.smsNotifications;
    setSettings((s) => ({ ...s, smsNotifications: newVal }));
    try {
      await applicantService.updateNotificationPrefs({ smsNotifications: newVal });
      toast.success(newVal ? "SMS notifications enabled" : "SMS notifications disabled");
    } catch {
      setSettings((s) => ({ ...s, smsNotifications: !newVal }));
      toast.error("Failed to update SMS preference");
    }
  };

  // ── Notification Pref Toggles (email, job alerts, app updates) ──
  const handleNotifPrefToggle = async (key: string) => {
    const newVal = !(settings as any)[key];
    setSettings((s) => ({ ...s, [key]: newVal }));
    try {
      await applicantService.updateNotificationPrefs({ [key]: newVal });
      toast.success("Preference updated");
    } catch {
      setSettings((s) => ({ ...s, [key]: !newVal }));
      toast.error("Failed to update preference");
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Save privacy/appearance preferences to local storage
      localStorage.setItem("legaforce_settings", JSON.stringify({
        profileVisibility: settings.profileVisibility,
        showEmail: settings.showEmail,
        showPhone: settings.showPhone,
        language: settings.language,
        promotionalEmails: settings.promotionalEmails,
      }));
      await new Promise((r) => setTimeout(r, 300));
      toast.success("Preferences saved successfully!");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings.currentPassword || !settings.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (settings.newPassword !== settings.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (settings.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: settings.currentPassword,
        newPassword: settings.newPassword,
      });
      toast.success("Password updated successfully!");
      setSettings((s) => ({
        ...s,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, disabled }: { enabled: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
        enabled ? "bg-accent" : "bg-muted-foreground/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences, notifications, and security settings.
        </p>
      </motion.div>

      {/* Account Info */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-accent/10">
            <User className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-lg font-display font-semibold">Account Information</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="font-medium">{user?.email || "—"}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Role</p>
            <Badge className="bg-accent/10 text-accent border-accent/20">
              {user?.role || "Applicant"}
            </Badge>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Email Verified</p>
            <div className="flex items-center gap-1">
              <CheckCircle className={cn("w-4 h-4", (user as any)?.isEmailVerified ? "text-emerald-500" : "text-muted-foreground")} />
              <span className="font-medium">{(user as any)?.isEmailVerified ? "Verified" : "Not verified"}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Account Status</p>
            <div className="flex items-center gap-1">
              <span className={cn("w-2 h-2 rounded-full", (user as any)?.isActive !== false ? "bg-emerald-500" : "bg-destructive")} />
              <span className="font-medium">{(user as any)?.isActive !== false ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Auto-Apply & Smart Features ─────────── */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-emerald-500/10">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold">Smart Job Features</h2>
            <p className="text-xs text-muted-foreground">Automate your job search with AI-powered tools</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" />
                <p className="font-medium text-sm">Auto-Apply to Matching Jobs</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically apply to new job openings that match your skills and profile. Earn 50 reward points per auto-application.
              </p>
              {autoApplyResult && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-500 mt-2 font-medium"
                >
                  ✓ {autoApplyResult}
                </motion.p>
              )}
            </div>
            <ToggleSwitch
              enabled={settings.autoApplyToMatching}
              onToggle={handleAutoApplyToggle}
              disabled={isLoadingSettings}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Notification Preferences ────────────── */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-lg font-display font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {/* Push Notifications — browser-level */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-blue-500" />
                <p className="font-medium text-sm">Push Notifications</p>
                {pushPermission === "denied" && (
                  <Badge variant="outline" className="text-destructive border-destructive/30 text-[10px]">
                    Blocked
                  </Badge>
                )}
                {pushPermission === "granted" && settings.pushNotifications && (
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-[10px]">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Receive browser push notifications for application updates, job matches, and important alerts — even when you're not on the site.
              </p>
              {pushPermission === "denied" && (
                <p className="text-xs text-destructive mt-1">
                  Permission is blocked. Go to your browser settings to re-enable notifications for this site.
                </p>
              )}
            </div>
            <ToggleSwitch
              enabled={settings.pushNotifications}
              onToggle={handlePushToggle}
              disabled={pushPermission === "denied"}
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-violet-500" />
                <p className="font-medium text-sm">SMS Notifications</p>
                <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 text-[10px]">
                  {settings.smsNotifications ? "Enabled" : "Off"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Receive text messages for critical status changes (shortlisted, selected, deployed). Standard SMS rates may apply.
              </p>
            </div>
            <ToggleSwitch
              enabled={settings.smsNotifications}
              onToggle={handleSmsToggle}
              disabled={isLoadingSettings}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <p className="font-medium text-sm">Email Notifications</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Receive important updates via email</p>
            </div>
            <ToggleSwitch
              enabled={settings.emailNotifications}
              onToggle={() => handleNotifPrefToggle("emailNotifications")}
              disabled={isLoadingSettings}
            />
          </div>

          {/* Application Updates */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Application Updates</p>
              <p className="text-xs text-muted-foreground">Get notified when your application status changes</p>
            </div>
            <ToggleSwitch
              enabled={settings.applicationUpdates}
              onToggle={() => handleNotifPrefToggle("applicationUpdates")}
              disabled={isLoadingSettings}
            />
          </div>

          {/* Job Alerts */}
          <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="font-medium text-sm">Job Alerts</p>
              <p className="text-xs text-muted-foreground">Receive alerts for new jobs matching your profile</p>
            </div>
            <ToggleSwitch
              enabled={settings.jobAlerts}
              onToggle={() => handleNotifPrefToggle("jobAlerts")}
              disabled={isLoadingSettings}
            />
          </div>

          {/* Promotional */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Promotional Emails</p>
              <p className="text-xs text-muted-foreground">Tips, offers, and platform updates</p>
            </div>
            <ToggleSwitch
              enabled={settings.promotionalEmails}
              onToggle={() => handleToggle("promotionalEmails")}
            />
          </div>
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/10">
            <Eye className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-lg font-display font-semibold">Privacy</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Profile Visibility</p>
              <p className="text-xs text-muted-foreground">Who can see your profile</p>
            </div>
            <Select
              value={settings.profileVisibility}
              onValueChange={(v) => handleSelectChange("profileVisibility", v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="employers">Employers Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Show Email Address</p>
              <p className="text-xs text-muted-foreground">Display email on your profile</p>
            </div>
            <ToggleSwitch
              enabled={settings.showEmail}
              onToggle={() => handleToggle("showEmail")}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Show Phone Number</p>
              <p className="text-xs text-muted-foreground">Display phone on your profile</p>
            </div>
            <ToggleSwitch
              enabled={settings.showPhone}
              onToggle={() => handleToggle("showPhone")}
            />
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10">
            <Palette className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-lg font-display font-semibold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-sm">Theme</p>
              <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select
              value={settings.theme}
              onValueChange={(v) => handleSelectChange("theme", v)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" /> Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm">Language</p>
              <p className="text-xs text-muted-foreground">Display language</p>
            </div>
            <Select
              value={settings.language}
              onValueChange={(v) => handleSelectChange("language", v)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fil">Filipino</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-500/10">
            <Lock className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-lg font-display font-semibold">Security</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Password</label>
            <Input
              type="password"
              value={settings.currentPassword}
              onChange={(e) => setSettings((s) => ({ ...s, currentPassword: e.target.value }))}
              placeholder="Enter current password"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <Input
                type="password"
                value={settings.newPassword}
                onChange={(e) => setSettings((s) => ({ ...s, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm Password</label>
              <Input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => setSettings((s) => ({ ...s, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <Button type="submit" variant="outline" disabled={isSaving}>
            <Shield className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </form>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSavePreferences}
          disabled={isSaving}
          className="gradient-bg-accent text-accent-foreground"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save All Preferences
        </Button>
        <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default SettingsPage;
