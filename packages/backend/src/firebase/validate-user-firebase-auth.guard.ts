import { IncomingMessage } from 'http';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ValidateUserFirebaseAuthGuard extends AuthGuard('validate-user-firebase-auth') {
  getRequest(executionContext: ExecutionContext): IncomingMessage {
    const context = GqlExecutionContext.create(executionContext);
    return context.getContext().req;
  }
}
