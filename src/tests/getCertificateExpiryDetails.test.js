// ../utils/getCertificateExpiryDetails.test.js
import { getCertificateExpiryDetails } from '../utils/getCertificateExpiryDetails';
import { certificatesDictionary as Dict } from '../appConstants';

describe('getCertificateExpiryDetails', () => {
  const mockDate = new Date('2025-04-16T15:07:00+05:30'); // current date as per your context

  beforeAll(() => {
    // Mock Date.now to control the current date
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('undefined date & isCME: true', () => {
    const result = getCertificateExpiryDetails(undefined, true);
    expect(result.expiryDays).toBe(''); 
    expect(result.expiryImage).toBe(Dict.full.image);
    expect(result.expiryColor).toBe(Dict.full.color);
  });

  test('expired certificate', () => {
    const expiryDate = '04-01-2025'; // in the past
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBeLessThanOrEqual(0);
    expect(result.expiryDays).toBe('');
    expect(result.expiryImage).toBe(Dict.expired.image);
    expect(result.expiryColor).toBe(Dict.expired.color);
  });

  test('expiry tomorrow', () => {
    const expiryDate = '04-17-2025'; // 1 day ahead
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBe(1);
    expect(result.expiryDays).toBe('1 Day');
    expect(result.expiryImage).toBe(Dict.lowest.image);
    expect(result.expiryColor).toBe(Dict.lowest.color);
  });

  test('expiry 30+ days', () => {
    const expiryDate = '05-17-2025'; // 31 days ahead
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBe(31);
    expect(result.expiryDays).toBe('30+ Days');
    expect(result.expiryImage).toBe(Dict.lowest.image);
    expect(result.expiryColor).toBe(Dict.lowest.color);
  });

  test('expiry 60+ days', () => {
    const expiryDate = '06-16-2025'; // 61 days ahead
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBe(61);
    expect(result.expiryDays).toBe('60+ Days');
    expect(result.expiryImage).toBe(Dict.low.image);
    expect(result.expiryColor).toBe(Dict.low.color);
  });

  test('expiry 90+ days', () => {
    const expiryDate = '07-16-2025'; // 91 days ahead
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBe(91);
    expect(result.expiryDays).toBe('90+ Days');
    expect(result.expiryImage).toBe(Dict.goingToExpire.image);
    expect(result.expiryColor).toBe(Dict.goingToExpire.color);
  });

  test('expiry 120+ days', () => {
    const expiryDate = '08-15-2025'; // 121 days ahead
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBe(121);
    expect(result.expiryDays).toBe('120+ Days');
    expect(result.expiryImage).toBe(Dict.fullQuarter.image);
    expect(result.expiryColor).toBe(Dict.fullQuarter.color);
  });

  test('expiry 150+ days', () => {
    const expiryDate = '09-14-2025'; // 151 days ahead
    const result = getCertificateExpiryDetails(expiryDate);
    expect(result.daysDifference).toBe(151);
    expect(result.expiryDays).toBe('150+ Days');
    expect(result.expiryImage).toBe(Dict.full.image);
    expect(result.expiryColor).toBe(Dict.full.color);
  });
});
