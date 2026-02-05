import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Bell,
  Lock,
  Mail,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

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
  const [settings, setSettings] = useState({
    platformName: "Legaforce Recruitment",
    supportEmail: "support@legaforce.com",
    defaultCurrency: "PHP",
    notifyOnNewApplication: true,
    notifyOnComplaint: true,
    notifyOnDeployment: true,
    maintenanceMode: false,
    autoApproveVerifiedEmployers: false,
    maxApplicationsPerJob: 100,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-display font-bold mb-1">
          Platform Settings ⚙️
        </h1>
        <p className="text-muted-foreground">
          Configure platform behavior and notifications
        </p>
      </motion.div>

      {/* Success Message */}
      {saved && (
        <motion.div
          variants={fadeInUp}
          className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700">
            Settings saved successfully!
          </p>
        </motion.div>
      )}

      {/* General Settings */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold">General Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Platform Name
            </label>
            <Input
              value={settings.platformName}
              onChange={(e) =>
                setSettings({ ...settings, platformName: e.target.value })
              }
              placeholder="Platform name"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Support Email
            </label>
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) =>
                setSettings({ ...settings, supportEmail: e.target.value })
              }
              placeholder="support@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Default Currency
            </label>
            <Input
              value={settings.defaultCurrency}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultCurrency: e.target.value,
                })
              }
              placeholder="PHP"
              maxLength={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Max Applications per Job
            </label>
            <Input
              type="number"
              value={settings.maxApplicationsPerJob}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxApplicationsPerJob: parseInt(e.target.value),
                })
              }
              placeholder="100"
            />
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <Bell className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">New Applications</p>
              <p className="text-sm text-muted-foreground">
                Notify when new applications are submitted
              </p>
            </div>
            <Switch
              checked={settings.notifyOnNewApplication}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifyOnNewApplication: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">New Complaints</p>
              <p className="text-sm text-muted-foreground">
                Notify when complaints are filed
              </p>
            </div>
            <Switch
              checked={settings.notifyOnComplaint}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifyOnComplaint: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Deployments</p>
              <p className="text-sm text-muted-foreground">
                Notify on deployment milestones
              </p>
            </div>
            <Switch
              checked={settings.notifyOnDeployment}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  notifyOnDeployment: checked,
                })
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold">Security & Access</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">
                Disable user access during maintenance
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  maintenanceMode: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Auto-Approve Verified Employers</p>
              <p className="text-sm text-muted-foreground">
                Automatically approve employer registrations with verified
                documents
              </p>
            </div>
            <Switch
              checked={settings.autoApproveVerifiedEmployers}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  autoApproveVerifiedEmployers: checked,
                })
              }
            />
          </div>
        </div>
      </motion.div>

      {/* API Settings */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold">API Settings</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm font-medium mb-2">API Endpoints Status</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication API</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Application API</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Deployment API</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Analytics API</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={fadeInUp}
        className="card-premium p-6 border-red-500/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-sm font-medium mb-3">Database Cleanup</p>
            <p className="text-sm text-muted-foreground mb-4">
              Remove old logs and temporary data (cannot be undone)
            </p>
            <Button variant="destructive" size="sm">
              Cleanup Database
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={fadeInUp} className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button
          className="gradient-bg-accent text-accent-foreground"
          onClick={handleSave}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default SettingsPage;
