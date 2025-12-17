import { useState, useCallback } from 'react';
import { copyToClipboard as copyText } from '../lib/clipboard';
import { UI_TEXT } from '../constants';
import { toast } from 'sonner@2.0.3';

/**
 * Custom hook for copying text to clipboard with feedback state
 * @returns Object with copy function and copied state
 */
export function useCopyToClipboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyWithFeedback = useCallback(
    async (text: string, id?: string): Promise<boolean> => {
      const success = await copyText(text);
      
      if (success && id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), UI_TEXT.COPY_FEEDBACK_DURATION);
      }
      
      return success;
    },
    []
  );

  const copyToClipboard = useCallback(
    async (text: string, successMessage?: string): Promise<boolean> => {
      const success = await copyText(text);
      
      if (success && successMessage) {
        toast.success(successMessage);
      } else if (!success) {
        toast.error('Failed to copy to clipboard');
      }
      
      return success;
    },
    []
  );

  return {
    copyWithFeedback,
    copyToClipboard,
    copiedId,
    isCopied: (id: string) => copiedId === id,
  };
}