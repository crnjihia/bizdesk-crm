'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  metadata?: any;
}

export default function ActivityFeed({ slug }: { slug: string }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/organizations/${slug}/activity`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setActivities(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="text-xs text-slate-500 py-4">Loading business activity...</div>;
  }

  if (activities.length === 0) {
    return <div className="text-xs text-slate-500 py-4">No recent activity logged yet.</div>;
  }

  return (
    <ul className="divide-y divide-slate-800 text-sm">
      {activities.map((act) => (
        <li key={act.id} className="py-2.5 flex items-center justify-between">
          <div>
            <span className="font-semibold text-white capitalize">{act.action.replace(/_/g, ' ')}</span>
            <span className="text-xs text-slate-400 block">{act.entityType}</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </li>
      ))}
    </ul>
  );
}
