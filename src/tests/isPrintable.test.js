import isPrintable from '../utils/isPrintable';

describe('isPrintable', () => {
  test('returns true and type "image" for jpeg files', () => {
    const result = isPrintable('file.jpeg');
    expect(result).toEqual({ printable: true, type: 'image' });
  });

  test('returns true and type "image" for jpg files', () => {
    const result = isPrintable('file.jpg');
    expect(result).toEqual({ printable: true, type: 'image' });
  });

  test('returns true and type "image" for png files', () => {
    const result = isPrintable('file.png');
    expect(result).toEqual({ printable: true, type: 'image' });
  });

  test('returns true and type "pdf" for pdf files', () => {
    const result = isPrintable('file.pdf');
    expect(result).toEqual({ printable: true, type: 'pdf' });
  });

  test('returns false for non-printable extensions like txt', () => {
    const result = isPrintable('file.txt');
    expect(result).toEqual({ printable: false, type: '' });
  });

  test('returns false for files without an extension', () => {
    const result = isPrintable('file');
    expect(result).toEqual({ printable: false, type: '' });
  });

  test('returns false for files with an empty string as name', () => {
    const result = isPrintable('');
    expect(result).toEqual({ printable: false, type: '' });
  });

  test('handles filenames with uppercase extensions', () => {
    const result = isPrintable('file.JPEG');
    expect(result).toEqual({ printable: true, type: 'image' });
  });

  test('handles filenames with multiple dots', () => {
    const result = isPrintable('my.file.name.png');
    expect(result).toEqual({ printable: true, type: 'image' });
  });

  test('handles filenames with trailing dots', () => {
    const result = isPrintable('file.');
    expect(result).toEqual({ printable: false, type: '' });
  });
});
