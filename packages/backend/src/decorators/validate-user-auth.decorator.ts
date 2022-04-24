import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidateUserFirebaseAuthGuard } from '~/firebase/validate-user-firebase-auth.guard';

export function ValidateUser() {
  return applyDecorators(UseGuards(ValidateUserFirebaseAuthGuard));
}
