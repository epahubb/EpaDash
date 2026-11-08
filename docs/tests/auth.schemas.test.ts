import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema, resetPasswordSchema } from "../src/modules/auth/auth.schemas";
import { updateMeSchema } from "../src/modules/users/user.schemas";

describe("request validation schemas", () => {
  it("normalizes registration email and accepts valid input", () => {
    const result = registerSchema.parse({
      email: "  USER@example.com ", password: "a-long-password-123", displayName: "Demo User"
    });
    expect(result.email).toBe("user@example.com");
  });

  it("rejects a weak password at registration", () => {
    expect(registerSchema.safeParse({
      email: "user@example.com", password: "short", displayName: "Demo"
    }).success).toBe(false);
  });

  it("rejects malformed login email", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "anything" }).success).toBe(false);
  });

  it("requires a sufficiently long reset password", () => {
    expect(resetPasswordSchema.safeParse({ token: "a".repeat(40), newPassword: "tiny" }).success).toBe(false);
  });

  it("rejects empty profile updates", () => {
    expect(updateMeSchema.safeParse({}).success).toBe(false);
  });
});
