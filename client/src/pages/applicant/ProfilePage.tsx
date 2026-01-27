import React from "react";

const ProfilePage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
      <svg
        className="w-8 h-8 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    </div>
    <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
    <p className="text-muted-foreground max-w-md">
      This page is under construction. Check back soon for updates!
    </p>
  </div>
);

export default ProfilePage;
