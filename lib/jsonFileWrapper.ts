import { JsonFileSync } from '@expo/json-file';
import { base64url } from '@/utils/base64url';

class SafeJsonFile {
  private file: JsonFileSync;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.file = new JsonFileSync(filePath);
  }

  read<T>(): T | null {
    try {
      const data = this.file.read();
      if (!data) return null;

      // If data is a string and base64url encoded, decode it
      if (typeof data === 'string' && this.isBase64UrlEncoded(data)) {
        const decoded = base64url.decodeToString(data);
        return JSON.parse(decoded) as T;
      }

      // If data is an object with a 'data' property that's base64url encoded
      if (typeof data === 'object' && data !== null && 'data' in data && typeof data.data === 'string') {
        const decoded = base64url.decodeToString(data.data);
        return JSON.parse(decoded) as T;
      }

      return data as T;
    } catch (error) {
      console.warn(`Error reading from ${this.filePath}:`, error);
      return null;
    }
  }

  write(data: unknown): boolean {
    try {
      // Stringify and encode data before writing
      const stringified = JSON.stringify(data);
      const encoded = base64url.encode(stringified);
      
      // Store the encoded data in an object
      this.file.write({ data: encoded });
      return true;
    } catch (error) {
      console.warn(`Error writing to ${this.filePath}:`, error);
      return false;
    }
  }

  private isBase64UrlEncoded(str: string): boolean {
    try {
      // Check if the string matches base64url format (RFC 4648)
      return /^[A-Za-z0-9_-]*={0,2}$/.test(str);
    } catch {
      return false;
    }
  }
}

export const createJsonFile = (filePath: string) => new SafeJsonFile(filePath);