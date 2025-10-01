import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// TextEncoder and TextDecoder polyfills for Jest
if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}
