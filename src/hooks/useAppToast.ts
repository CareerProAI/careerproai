import { useState } from 'react';

export function useAppToast() {
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return { toast, triggerToast };
}
