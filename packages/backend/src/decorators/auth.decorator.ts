import { applyDecorators, UseGuards } from "@nestjs/common";
import { FirebaseAuthGuard } from "~/firebase/firebase-auth.guard";

export function Auth() {
    return applyDecorators(UseGuards(FirebaseAuthGuard))
}