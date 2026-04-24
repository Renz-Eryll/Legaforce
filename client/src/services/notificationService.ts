/**
 * Browser Push Notification Service — Legaforce
 *
 * Wraps the native Notification API + Service Worker push
 * to provide a unified interface for in-app and push notifications.
 */

export type NotificationPermission = "granted" | "denied" | "default";

export interface LegaforceNotification {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Check if browser supports notifications
   */
  get isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  /**
   * Get current permission status
   */
  get permission(): NotificationPermission {
    if (!this.isSupported) return "denied";
    return Notification.permission as NotificationPermission;
  }

  /**
   * Request notification permission from the user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      console.warn("Notifications not supported in this browser");
      return "denied";
    }

    try {
      const result = await Notification.requestPermission();
      return result as NotificationPermission;
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      return "denied";
    }
  }

  /**
   * Register/get the service worker registration
   */
  async getRegistration(): Promise<ServiceWorkerRegistration | null> {
    if (this.swRegistration) return this.swRegistration;

    if (!("serviceWorker" in navigator)) return null;

    try {
      this.swRegistration = await navigator.serviceWorker.ready;
      return this.swRegistration;
    } catch {
      return null;
    }
  }

  /**
   * Show a push notification via Service Worker
   */
  async showNotification(notification: LegaforceNotification): Promise<void> {
    // Try service worker notification first (works even when tab is not focused)
    const reg = await this.getRegistration();
    if (reg) {
      await reg.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon || "/legaforce-logo.png",
        badge: "/legaforce-logo.png",
        tag: notification.tag || `legaforce-${Date.now()}`,
        data: { url: notification.url || "/app/dashboard" },
        vibrate: [100, 50, 100],
      } as NotificationOptions & { vibrate: number[] });
      return;
    }

    // Fallback to native Notification API
    if (this.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || "/legaforce-logo.png",
        tag: notification.tag,
      });
    }
  }

  /**
   * Show notification if permission granted, otherwise silently skip
   */
  async notify(notification: LegaforceNotification): Promise<void> {
    if (this.permission !== "granted") return;
    try {
      await this.showNotification(notification);
    } catch (err) {
      console.warn("Failed to show notification:", err);
    }
  }

  /**
   * Helper: notify on application status change
   */
  async notifyStatusChange(
    status: string,
    jobTitle: string,
    companyName: string
  ): Promise<void> {
    const messages: Record<string, { title: string; body: string }> = {
      SHORTLISTED: {
        title: "Application Shortlisted! 🎉",
        body: `Your application for "${jobTitle}" at ${companyName} has been shortlisted.`,
      },
      INTERVIEWED: {
        title: "Interview Completed",
        body: `Your interview for "${jobTitle}" at ${companyName} has been recorded.`,
      },
      SELECTED: {
        title: "You've Been Selected! 🎉",
        body: `Congratulations! You've been selected for "${jobTitle}" at ${companyName}.`,
      },
      DEPLOYED: {
        title: "Deployment Confirmed! ✈️",
        body: `You have been deployed for "${jobTitle}" at ${companyName}.`,
      },
      REJECTED: {
        title: "Application Update",
        body: `Your application for "${jobTitle}" at ${companyName} was not successful. Keep applying!`,
      },
    };

    const msg = messages[status];
    if (!msg) return;

    await this.notify({
      ...msg,
      url: "/app/applications",
      tag: `status-${status}-${Date.now()}`,
    });
  }

  /**
   * Helper: notify on new job match
   */
  async notifyJobMatch(jobTitle: string, companyName: string): Promise<void> {
    await this.notify({
      title: "New Job Match! 💼",
      body: `A new job "${jobTitle}" at ${companyName} matches your profile.`,
      url: "/app/jobs",
      tag: `job-match-${Date.now()}`,
    });
  }

  /**
   * Helper: notify on auto-apply
   */
  async notifyAutoApply(count: number): Promise<void> {
    if (count <= 0) return;
    await this.notify({
      title: "Auto-Apply Active ⚡",
      body: `We automatically applied you to ${count} matching job(s).`,
      url: "/app/applications",
      tag: `auto-apply-${Date.now()}`,
    });
  }
}

// Singleton
export const notificationService = new NotificationService();
