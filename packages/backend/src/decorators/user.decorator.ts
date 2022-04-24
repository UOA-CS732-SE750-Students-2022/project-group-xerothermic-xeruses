import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
// eslint-disable-next-line import/no-unresolved
import { DecodedIdToken } from 'firebase-admin/auth';
import { UserDocument } from '~/database/user/user.schema';

export const User = createParamDecorator(
  (data: unknown, executionContext: ExecutionContext): DecodedIdToken | UserDocument => {
    const context = GqlExecutionContext.create(executionContext);
    return context.getContext().req.user;
  },
);
