// Base64URL implementation following RFC 4648
export const base64url = {
  /**
   * Encodes data to base64url format
   * Implements RFC 4648 §5
   */
  encode(input: string | Uint8Array): string {
    try {
      // Convert string to Uint8Array if needed
      const data = typeof input === 'string' 
        ? new TextEncoder().encode(input)
        : input;
      
      // Create base64 string
      let base64: string;
      if (typeof window !== 'undefined') {
        // Browser environment - use btoa
        const binString = Array.from(data)
          .map(byte => String.fromCharCode(byte))
          .join('');
        base64 = window.btoa(binString);
      } else {
        // Node.js environment - use Buffer
        const buffer = Buffer.from(data);
        base64 = buffer.toString('base64');
      }
      
      // Convert to base64url format
      return base64
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_') // Convert '/' to '_'
        .replace(/=+$/, ''); // Remove padding '='
    } catch (err) {
      console.error('Base64URL encoding error:', err);
      throw new Error('Failed to encode data to base64url');
    }
  },

  /**
   * Decodes base64url format to Uint8Array
   * Implements RFC 4648 §5
   */
  decode(input: string): Uint8Array {
    try {
      // Add back padding if needed
      const pad = input.length % 4;
      const padded = pad 
        ? input + '='.repeat(4 - pad)
        : input;
      
      // Convert from base64url to standard base64
      const base64 = padded
        .replace(/-/g, '+') // Convert '-' back to '+'
        .replace(/_/g, '/'); // Convert '_' back to '/'
      
      if (typeof window !== 'undefined') {
        // Browser environment - use atob
        const binaryStr = window.atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        return bytes;
      } else {
        // Node.js environment - use Buffer
        return new Uint8Array(Buffer.from(base64, 'base64'));
      }
    } catch (err) {
      console.error('Base64URL decoding error:', err);
      throw new Error('Failed to decode base64url data');
    }
  },

  /**
   * Convenience method to decode base64url to string
   */
  decodeToString(input: string): string {
    try {
      return new TextDecoder().decode(this.decode(input));
    } catch (err) {
      console.error('Base64URL string decoding error:', err);
      throw new Error('Failed to decode base64url to string');
    }
  }
};