import { generateMonthRange } from "../views/AdminDashboard/utils";

describe('generateMonthRange', () => {
  test('generates range for the same month', () => {
    const startMonth = new Date('2025-04-01');
    const endMonth = new Date('2025-04-30');
    const expected = ['04 2025'];
    expect(generateMonthRange(startMonth, endMonth)).toEqual(expected);
  });

  test('generates range for multiple months', () => {
    const startMonth = new Date('2025-01-01');
    const endMonth = new Date('2025-03-31');
    const expected = ['01 2025', '02 2025', '03 2025'];
    expect(generateMonthRange(startMonth, endMonth)).toEqual(expected);
  });

  test('handles date objects without time precision', () => {
    const startMonth = new Date(2025, 6, 1); // July 2025
    const endMonth = new Date(2025, 8, 1); // September 2025
    const expected = ['07 2025', '08 2025', '09 2025'];
    expect(generateMonthRange(startMonth, endMonth)).toEqual(expected);
  });

  test('returns an empty array when startMonth is after endMonth', () => {
    const startMonth = new Date('2025-05-01');
    const endMonth = new Date('2025-04-30');
    expect(generateMonthRange(startMonth, endMonth)).toEqual([]);
  });

  test('handles edge case of identical start and end month', () => {
    const startMonth = new Date('2025-06-01');
    const endMonth = new Date('2025-06-30');
    const expected = ['06 2025'];
    expect(generateMonthRange(startMonth, endMonth)).toEqual(expected);
  });

  test('handles large ranges across multiple years', () => {
    const startMonth = new Date('2023-12-01');
    const endMonth = new Date('2025-02-01');
    const expected = [
      '12 2023',
      '01 2024',
      '02 2024',
      '03 2024',
      '04 2024',
      '05 2024',
      '06 2024',
      '07 2024',
      '08 2024',
      '09 2024',
      '10 2024',
      '11 2024',
      '12 2024',
      '01 2025',
      '02 2025'
    ];
    expect(generateMonthRange(startMonth, endMonth)).toEqual(expected);
  });
});
