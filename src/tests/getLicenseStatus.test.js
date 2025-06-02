import { getLicenseStatus } from "../views/AdminView/utils";

describe('getLicenseStatus', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-04-25T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns "Expired" for a past date', () => {
    const pastDate = '2025-04-20';
    expect(getLicenseStatus(pastDate)).toBe('Expired');
  });

  test('returns "RiskFree" for a date more than 180 days in the future', () => {
    const futureDate = '2025-11-01';
    expect(getLicenseStatus(futureDate)).toBe('RiskFree');
  });

  test('returns the correct expiration message for a date within 180 days', () => {
    const futureDate = '2025-07-20';
    expect(getLicenseStatus(futureDate)).toBe('Expiration in 86 days');
  });

  test('handles a date exactly 180 days in the future', () => {
    const futureDate = '2025-10-22';
    expect(getLicenseStatus(futureDate)).toBe('Expiration in 180 days');
  });

  test('handles a date exactly today', () => {
    const today = '2025-04-25';
    expect(getLicenseStatus(today)).toBe('Expiration in 0 days');
  });

//   test('handles invalid date input gracefully', () => {
//     const invalidDate = 'invalid-date';
//     expect(getLicenseStatus(invalidDate)).toBe('Expired'); // Invalid date defaults to "Expired"
//   });
});
