export type MaybeUndefined<T> = { [P in keyof T]: T[P] | undefined };
