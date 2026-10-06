import { useState, useCallback } from 'react';
import { useHaptics } from '@/shared/telegram';

/**
 * Hook to copy text to the clipboard with haptic feedback and timeout state.
 */
export function useCopyToClipboard(resetDelayMs: number = 2000) {
  const [copied, setCopied] = useState(false);
  const { notification } = useHaptics();

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        return false;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        notification('success');
        setTimeout(() => setCopied(false), resetDelayMs);
        return true;
      } catch {
        notification('error');
        setCopied(false);
        return false;
      }
    },
    [notification, resetDelayMs],
  );

  return { copied, copy };
}
