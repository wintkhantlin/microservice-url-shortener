import { randomBytes } from 'node:crypto';

const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateRandomCode(length: number): string {
  let res = '';

  while (res.length < length) {
    const buf = randomBytes(1);
    const v = buf[0]!;

    if (v < 62 * 4) {
      res += charset[v % 62];
    }
  }

  return res;
}
