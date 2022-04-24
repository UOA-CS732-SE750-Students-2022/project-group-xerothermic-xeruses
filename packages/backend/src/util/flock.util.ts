import { randomInt } from 'crypto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FlockService } from '~/database/flock/flock.service';

// eslint-disable-next-line no-mixed-operators
const MAX_INT_VALUE = 2 ** 48 - 1;

@Injectable()
export class FlockUtil {
  constructor(@Inject(forwardRef(() => FlockService)) private readonly flockService: FlockService) {}

  async generateFlockCode(length: number) {
    while (true) {
      const flockCode = randomInt(MAX_INT_VALUE).toString(36).substring(0, length).toUpperCase();
      const existingFlock = await this.flockService.findOneByCode(flockCode);

      if (!existingFlock) {
        return flockCode;
      }
    }
  }
}
