import { pad2 } from './helpers.js';

describe('pad2', () => {
  it('pads positive numbers under 10', () => {
    expect(pad2(3)).toBe('03');
  });

  it('pads negative numbers under 10 with leading zero after sign', () => {
    expect(pad2(-3)).toBe('-03');
  });
});
