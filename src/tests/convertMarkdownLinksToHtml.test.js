import { convertMarkdownLinksToHtml } from "../views/Acquisition/StateLicense/utils";

describe('convertMarkdownLinksToHtml', () => {
  test('converts a single markdown link to HTML', () => {
    const input = '[Google](https://www.google.com)';
    const expectedOutput = '<a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline">Google</a>';
    expect(convertMarkdownLinksToHtml(input)).toBe(expectedOutput);
  });

  test('converts multiple markdown links to HTML', () => {
    const input = '[Google](https://www.google.com) and [Bing](https://www.bing.com)';
    const expectedOutput = '<a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline">Google</a> and <a href="https://www.bing.com" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline">Bing</a>';
    expect(convertMarkdownLinksToHtml(input)).toBe(expectedOutput);
  });

  test('returns the input text if there are no markdown links', () => {
    const input = 'This is a plain text without links.';
    expect(convertMarkdownLinksToHtml(input)).toBe(input);
  });

  test('handles empty input gracefully', () => {
    const input = '';
    expect(convertMarkdownLinksToHtml(input)).toBe('');
  });

  test('returns undefined if input is undefined', () => {
    expect(convertMarkdownLinksToHtml(undefined)).toBeUndefined();
  });

  test('handles complex input with markdown links and plain text', () => {
    const input = "Visit [Google](https://www.google.com), it's better than [Yahoo](https://www.yahoo.com).";
    const expectedOutput = 'Visit <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline">Google</a>, it\'s better than <a href="https://www.yahoo.com" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline">Yahoo</a>.';
    expect(convertMarkdownLinksToHtml(input)).toBe(expectedOutput);
  });
});
