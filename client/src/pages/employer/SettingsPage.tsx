import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, Eye, Globe, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    emailNotifications: true,
    applicationNotifications: true,
    paymentNotifications: true,
    marketingEmail: false,
    language: "en",
    timezone: "PH",
  });

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-3xl font-display font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Application Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified when candidates apply
              </p>
            </div>
            <Switch
              checked={settings.applicationNotifications}
              onChange={() => handleToggle("applicationNotifications")}
            />
          </div>
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Payment Notifications</p>
              <p className="text-sm text-muted-foreground">
                Get notified about invoice payments
              </p>
            </div>
            <Switch
              checked={settings.paymentNotifications}
              onChange={() => handleToggle("paymentNotifications")}
            />
          </div>
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Email</p>
              <p className="text-sm text-muted-foreground">
                Receive promotional content
              </p>
            </div>
            <Switch
              checked={settings.marketingEmail}
              onChange={() => handleToggle("marketingEmail")}
            />
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold">Preferences</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleSelectChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="tl">Tagalog</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Timezone</label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => handleSelectChange("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PH">Philippines (UTC+8)</SelectItem>
                <SelectItem value="SA">Saudi Arabia (UTC+3)</SelectItem>
                <SelectItem value="AE">UAE (UTC+4)</SelectItem>
                <SelectItem value="QA">Qatar (UTC+3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeInUp} className="card-premium p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Current Password
            </label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              New Password
            </label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Confirm Password
            </label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button className="gradient-bg-accent text-accent-foreground">
            Update Password
          </Button>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={fadeInUp} className="flex gap-2">
        <Button className="gradient-bg-accent text-accent-foreground">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
        <Button variant="outline">Cancel</Button>
      </motion.div>
    </motion.div>
  );
}

export default SettingsPage;
