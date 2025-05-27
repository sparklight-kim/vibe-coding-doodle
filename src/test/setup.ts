import '@testing-library/jest-dom'

// Mock import.meta.glob for tests
Object.defineProperty(import.meta, 'glob', {
  value: () => ({}),
  writable: true,
}) 