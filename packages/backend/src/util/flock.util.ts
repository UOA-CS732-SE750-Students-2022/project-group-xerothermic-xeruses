import { randomInt } from 'crypto';
import { Injectable } from '@nestjs/common';

// eslint-disable-next-line no-mixed-operators
const MAX_INT_VALUE = 2 ** 48 - 1;

@Injectable()
export class FlockUtil {
  generateFlockCode(length: number) {
    return randomInt(MAX_INT_VALUE).toString(36).substring(0, length).toUpperCase();
  }
}
