import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';

const MAX_INT_VALUE = 2 ** 48 - 1;

@Injectable()
export class FlockUtil {
  generateFlockCode(length: number) {
    return randomInt(MAX_INT_VALUE).toString(36).substring(0, length).toUpperCase();
  }
}
