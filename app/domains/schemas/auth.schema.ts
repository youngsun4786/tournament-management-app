import { z } from "zod";


// Define the role type as a union of string literals
const UserRole = {
  SCORE_KEEPER: "score-keeper",
  ADMIN: "admin",
  CAPTAIN: "captain",
} as const;

// Use as a type
export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const UserMetaSchema = z.object({
  firstName: z.string().min(3, {
    message: "First name must be at least 3 characters",
  }).max(20),
  lastName: z.string().min(3,
    {
      message: "Last name must be at least 3 characters",
    }
  ).max(20),
})

export type UserMeta = z.infer<typeof UserMetaSchema>

// TODO: Refine password === confirmPassword
export const SignUpSchema = z.object({
  firstName: UserMetaSchema.shape.firstName,
  lastName: UserMetaSchema.shape.lastName,  
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  role: z.custom<UserRoleType>((value) => Object.values(UserRole).includes(value as UserRoleType), {
    message: "Please select a valid role",
  }),
})

export type SignUpSchema = z.infer<typeof SignUpSchema>

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type SignInSchema = z.infer<typeof SignInSchema>

export type AuthState =
  | {
      isAuthenticated: false
    }
  | {
      isAuthenticated: true
      user: User
    }

export type User = { email?: string; meta: UserMeta }