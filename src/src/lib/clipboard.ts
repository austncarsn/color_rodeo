/**
 * Clipboard utility with fallback support for browsers/contexts
 * where the Clipboard API is blocked by permissions policy.
 */

/**
 * Copies text to clipboard using modern API with fallback to legacy method.
 * 
 * @param text - The text to copy to clipboard
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first (only in secure contexts)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Silently fall through to fallback if API is blocked by permissions policy
      // This is expected in certain iframe contexts or permission-restricted environments
      if (err instanceof Error && err.name !== 'NotAllowedError') {
        console.warn('Clipboard API failed:', err.message);
      }
      // Fall through to fallback method
    }
  }

  // Fallback: Use legacy execCommand method
  return copyToClipboardFallback(text);
}

/**
 * Legacy fallback method using document.execCommand('copy').
 * Works in contexts where Clipboard API is blocked.
 */
function copyToClipboardFallback(text: string): boolean {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    
    // Style it to be invisible and non-intrusive
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    textarea.setAttribute('readonly', '');
    textarea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textarea);
    
    // iOS requires different handling
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      textarea.setSelectionRange(0, text.length);
    } else {
      // Select the text for other platforms
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, text.length);
    }
    
    // Execute copy command
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textarea);
    
    if (!successful) {
      console.warn('execCommand copy failed');
    }
    
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}

/**
 * Check if clipboard operations are available in the current context.
 */
export function isClipboardAvailable(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    document.queryCommandSupported?.('copy')
  );
}