'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ErrorToast({ failed }: { failed: string }) {
  useEffect(() => {
    console.log(failed);
    if (failed === 'true') {
      setTimeout(() => {
        toast.error('Failed to fetch');
      }, 0);
    }
  }, [failed]);
  return null;
}
