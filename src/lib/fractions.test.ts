import { describe, expect, it } from 'vitest';
import { formatNumber, parseQuantity, scaleQuantity } from './fractions';

describe('parseQuantity', () => {
  it('parses whole, decimal, fraction and mixed numbers', () => {
    expect(parseQuantity('2')).toEqual([2]);
    expect(parseQuantity('1.5')).toEqual([1.5]);
    expect(parseQuantity('1/2')).toEqual([0.5]);
    expect(parseQuantity('1 1/2')).toEqual([1.5]);
    expect(parseQuantity('1½')).toEqual([1.5]);
    expect(parseQuantity('¾')).toEqual([0.75]);
  });

  it('parses ranges', () => {
    expect(parseQuantity('1-2')).toEqual([1, 2]);
    expect(parseQuantity('2 – 3')).toEqual([2, 3]);
  });

  it('returns null for text and empty values', () => {
    expect(parseQuantity('')).toBeNull();
    expect(parseQuantity(undefined)).toBeNull();
    expect(parseQuantity('a pinch')).toBeNull();
    expect(parseQuantity('1/0')).toBeNull();
  });
});

describe('formatNumber', () => {
  it('uses kitchen fractions', () => {
    expect(formatNumber(1.5)).toBe('1½');
    expect(formatNumber(0.333)).toBe('⅓');
    expect(formatNumber(0.25)).toBe('¼');
    expect(formatNumber(2)).toBe('2');
    expect(formatNumber(2.97)).toBe('3');
    expect(formatNumber(0.02)).toBe('⅛');
  });

  it('rounds large values to whole numbers', () => {
    expect(formatNumber(12.4)).toBe('12');
    expect(formatNumber(250 * 1.5)).toBe('375');
  });
});

describe('scaleQuantity', () => {
  it('scales numeric quantities', () => {
    expect(scaleQuantity('1/2', 2)).toBe('1');
    expect(scaleQuantity('1 1/2', 2)).toBe('3');
    expect(scaleQuantity('3', 0.5)).toBe('1½');
    expect(scaleQuantity('1-2', 2)).toBe('2–4');
  });

  it('leaves text untouched', () => {
    expect(scaleQuantity('a handful', 2)).toBe('a handful');
    expect(scaleQuantity('', 2)).toBe('');
  });
});
