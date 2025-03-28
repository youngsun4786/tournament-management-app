import { z } from "zod";


// Define the role type as a union of string literals
const UserRole = {
  SCORE_KEEPER: "score-keeper",
  ADMIN: "admin",
  CAPTAIN: "captain",
  PLAYER: "player",
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
  teamId: z.string().uuid().nullable(),
})

export type UserMeta = z.infer<typeof UserMetaSchema>

export const SignUpSchema = z.object({
  firstName: UserMetaSchema.shape.firstName,
  lastName: UserMetaSchema.shape.lastName,  
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.custom<UserRoleType>((value) => Object.values(UserRole).includes(value as UserRoleType), {
    message: "Please select a valid role",
  }),
  teamId: z.string().uuid().nullable(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // If role is captain, teamId is required and must be a valid UUID
  if (data.role === "captain") {
    return data.teamId && data.teamId.length > 0;
  }
  // For other roles, teamId is not validated
  return true;
}, {
  message: "Team selection is required for captains",
  path: ["teamId"],
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

export type User = { 
  email?: string; 
  meta: UserMeta;
  role?: UserRoleType;
}