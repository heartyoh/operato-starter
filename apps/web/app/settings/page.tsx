'use client';

import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    const storedNotifications = localStorage.getItem('notifications');

    if (storedDarkMode !== null) setDarkMode(storedDarkMode === 'true');
    if (storedNotifications !== null)
      setNotifications(storedNotifications === 'true');
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('notifications', notifications.toString());
  }, [darkMode, notifications]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="mr-2"
          />
          <label>Enable Dark Mode</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="mr-2"
          />
          <label>Enable Notifications</label>
        </div>
      </div>
    </main>
  );
}
