/**
 * SSE (Server-Sent Events) Notification Service — Legaforce
 *
 * Provides real-time push of events to connected browser clients.
 * Each user holds an open SSE connection keyed by userId.
 */

// Map of userId → Set<Response> (one user can have multiple tabs)
const clients = new Map();

/**
 * Register a new SSE client connection.
 * Call this from the SSE endpoint handler.
 */
export function addClient(userId, res) {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  // Clean up on disconnect
  res.on("close", () => {
    const set = clients.get(userId);
    if (set) {
      set.delete(res);
      if (set.size === 0) clients.delete(userId);
    }
  });
}

/**
 * Send an event to a specific user across all their open tabs.
 */
export function sendToUser(userId, event, data) {
  const set = clients.get(userId);
  if (!set || set.size === 0) return;

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of set) {
    try {
      res.write(payload);
    } catch {
      set.delete(res);
    }
  }
}

/**
 * Broadcast an event to ALL connected clients (e.g. system announcements).
 */
export function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [, set] of clients) {
    for (const res of set) {
      try {
        res.write(payload);
      } catch {
        set.delete(res);
      }
    }
  }
}

/**
 * Get count of currently connected clients (for monitoring).
 */
export function getClientCount() {
  let count = 0;
  for (const [, set] of clients) {
    count += set.size;
  }
  return count;
}

/**
 * Notify an applicant of a status change (called from employer/admin controllers).
 */
export function notifyStatusChange(applicantUserId, { status, jobTitle, companyName, applicationId }) {
  const typeMap = {
    SHORTLISTED: "success",
    INTERVIEWED: "info",
    SELECTED: "success",
    DEPLOYED: "success",
    REJECTED: "warning",
    PROCESSING: "info",
  };

  const titleMap = {
    SHORTLISTED: "Application Shortlisted! 🎉",
    INTERVIEWED: "Interview Recorded",
    SELECTED: "You've Been Selected! 🎉",
    DEPLOYED: "Deployment Confirmed! ✈️",
    REJECTED: "Application Update",
    PROCESSING: "Application Processing",
  };

  const bodyMap = {
    SHORTLISTED: `Your application for "${jobTitle}" at ${companyName} has been shortlisted.`,
    INTERVIEWED: `Your interview for "${jobTitle}" at ${companyName} has been recorded.`,
    SELECTED: `Congratulations! You've been selected for "${jobTitle}" at ${companyName}.`,
    DEPLOYED: `You have been deployed for "${jobTitle}" at ${companyName}.`,
    REJECTED: `Your application for "${jobTitle}" at ${companyName} was not selected. Keep applying!`,
    PROCESSING: `Your application for "${jobTitle}" at ${companyName} is being processed.`,
  };

  sendToUser(applicantUserId, "status_change", {
    id: `sse-${applicationId}-${status}-${Date.now()}`,
    type: typeMap[status] || "info",
    title: titleMap[status] || "Application Update",
    message: bodyMap[status] || `Your application status has been updated to ${status}.`,
    status,
    jobTitle,
    companyName,
    applicationId,
    date: new Date().toISOString(),
    read: false,
  });
}

/**
 * Notify a user of a new matching job.
 */
export function notifyNewJobMatch(applicantUserId, { jobTitle, companyName, jobId, matchScore }) {
  sendToUser(applicantUserId, "job_match", {
    id: `sse-match-${jobId}-${Date.now()}`,
    type: "info",
    title: "New Job Match! 💼",
    message: `"${jobTitle}" at ${companyName} matches your profile${matchScore ? ` (${matchScore}% match)` : ""}.`,
    jobId,
    matchScore,
    date: new Date().toISOString(),
    read: false,
  });
}
