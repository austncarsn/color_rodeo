import { useState, useCallback } from 'react';
import { copyToClipboard } from '../lib/clipboard';
import { UI_TEXT } from '../constants';

/**
 * Custom hook for copying text to clipboard with feedback state
 * @returns Object with copy function and copied state
 */
export function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyWithFeedback = useCallback(
    async (text: string, id?: string): Promise<boolean> => {
      const success = await copyToClipboard(text);
      
      if (success && id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), UI_TEXT.COPY_FEEDBACK_DURATION);
      }
      
      return success;
    },
    []
  );

  return {
    copyWithFeedback,
    copiedId,
    isCopied: (id: string) => copiedId === id,
  };
}
