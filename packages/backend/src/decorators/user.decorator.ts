import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator((data: unknown, executionContext: ExecutionContext) => {
  const context = GqlExecutionContext.create(executionContext);
  return context.getContext().req.user;
});
