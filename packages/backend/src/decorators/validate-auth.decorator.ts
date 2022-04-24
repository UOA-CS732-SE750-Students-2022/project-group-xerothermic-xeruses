import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidateFirebaseAuthGuard } from '~/firebase/validate-firebase-auth.guard';

export function ValidateAuth() {
  return applyDecorators(UseGuards(ValidateFirebaseAuthGuard));
}
