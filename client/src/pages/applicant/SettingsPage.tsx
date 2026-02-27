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
    // Notification preferences
    emailNotifications: true,
    applicationUpdates: true,
    jobAlerts: true,
    promotionalEmails: false,

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

  // Load theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setSettings((s) => ({ ...s, theme: savedTheme }));
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

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Save preferences to local storage for now
      localStorage.setItem("legaforce_settings", JSON.stringify({
        emailNotifications: settings.emailNotifications,
        applicationUpdates: settings.applicationUpdates,
        jobAlerts: settings.jobAlerts,
        promotionalEmails: settings.promotionalEmails,
        profileVisibility: settings.profileVisibility,
        showEmail: settings.showEmail,
        showPhone: settings.showPhone,
        language: settings.language,
      }));
      await new Promise((r) => setTimeout(r, 500)); // Simulate API call
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
      await new Promise((r) => setTimeout(r, 800)); // Simulate API call
      toast.success("Password updated successfully!");
      setSettings((s) => ({
        ...s,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
        enabled ? "bg-accent" : "bg-muted-foreground/30"
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

      {/* Notification Preferences */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-500/10">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-lg font-display font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "emailNotifications", label: "Email Notifications", desc: "Receive important updates via email" },
            { key: "applicationUpdates", label: "Application Updates", desc: "Get notified when your application status changes" },
            { key: "jobAlerts", label: "Job Alerts", desc: "Receive alerts for new jobs matching your profile" },
            { key: "promotionalEmails", label: "Promotional Emails", desc: "Tips, offers, and platform updates" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ToggleSwitch
                enabled={(settings as any)[item.key]}
                onToggle={() => handleToggle(item.key)}
              />
            </div>
          ))}
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
