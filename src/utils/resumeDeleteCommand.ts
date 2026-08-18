export type ResumeDeleteCommand = { id: string; fileName: string };

/** Command: a pending delete, or null (Null Object) when nothing is queued. */
export function createResumeDeleteCommand(
  profile: { id: string; fileName?: string } | null,
): ResumeDeleteCommand | null {
  if (!profile?.id) return null;
  return { id: profile.id, fileName: profile.fileName?.trim() || 'this resume' };
}

export function resumeDeleteDialogCopy(fileName: string): { title: string; description: string } {
  const name = fileName?.trim();
  return {
    title: name && name !== 'this resume' ? `Delete "${name}"?` : 'Delete this resume?',
    description: 'This cannot be undone. Saved job matches for this resume will also be removed.',
  };
}
