'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Modal } from '@ui/index';

type Profile = {
  name: string;
  email: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {loading && <p>Loading profile...</p>}
      {!loading && profile && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              readOnly
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
        </div>
      )}
    </main>
  );
}
