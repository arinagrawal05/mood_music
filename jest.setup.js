// Add any global setup needed for Jest tests
import "@testing-library/jest-dom"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Suppress console logs during tests
console.log = jest.fn()
console.error = jest.fn()
console.warn = jest.fn()
