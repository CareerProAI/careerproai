import React from 'react';
import Card from './ui/Card';

interface ApplicationStats {
  applied: number;
  screening: number;
  interviewing: number;
  offered: number;
}

interface ApplicationsKpiRowProps {
  stats: ApplicationStats;
}

export default function ApplicationsKpiRow({ stats }: ApplicationsKpiRowProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card padding="sm" rounded="xl" className="text-center">
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Applied</p>
        <p className="font-sans text-2xl font-extrabold text-tertiary">{stats.applied}</p>
      </Card>
      <Card padding="sm" rounded="xl" className="text-center">
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Screening</p>
        <p className="font-sans text-2xl font-extrabold text-secondary">{stats.screening}</p>
      </Card>
      <Card padding="sm" rounded="xl" className="text-center">
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Interviewing</p>
        <p className="font-sans text-2xl font-extrabold text-secondary">{stats.interviewing}</p>
      </Card>
      <Card padding="sm" rounded="xl" className="text-center">
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-1">Offered</p>
        <p className="font-sans text-2xl font-extrabold text-tertiary">{stats.offered}</p>
      </Card>
    </section>
  );
}
