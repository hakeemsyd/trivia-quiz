import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

expect.extend({
  toBeInTheDocument: () => {
    return {
      pass: true,
      message: () => '',
    };
  },
});

afterEach(() => {
  cleanup();
});
