import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "~/lib/utils/supabase-server";
import {
  AuthState,
  SignInSchema,
  SignUpSchema,
  UserRoleType
} from "../schemas/auth.schema";

export const signUp = createServerFn(
  {
    method: 'POST',
  }
)
  .inputValidator(SignUpSchema)
  .handler(async ({ data }) => {
    const admin_emails = process.env.ADMIN_EMAILS!;
    const captain_emails = process.env.CAPTAIN_EMAILS!;
    console.log("data: ",  data);

    const authorized_admin_emails = admin_emails.split(',')
      .map(email => email.trim().toLowerCase()) || [];
    const authorized_captain_emails = captain_emails.split(',')
      .map(email => email.trim().toLowerCase()) || [];

    const roleToUse = data.role;
    if (data.role === 'admin' && !authorized_admin_emails.includes(data.email.toLowerCase())) {
      throw new Error("You are not authorized to create an admin account");
    }

    if (data.role === 'captain' && !authorized_captain_emails.includes(data.email.toLowerCase())) {
      throw new Error("You are not authorized to create a captain account");
    }

    const supabase = getSupabaseServerClient();
    const { error } =
      await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: roleToUse,
            teamId: data.teamId
          },
        },
      })
    if (error) {
      switch (error.code) {
        case "email_exists":
          throw new Error("Email already exists")
        case "weak_password":
          throw new Error("Your password is too weak")
        default:
          console.log("error: ", error);
          throw new Error(error.message)
      }
    }
  })

export const signIn = createServerFn(
  {
    method: 'POST',
  }
)
  .inputValidator(SignInSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(error.message);
    }
  })

export const signOut = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut()
  redirect({ to: "/" });
})

export const getUser = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { isAuthenticated: false } as AuthState
  }
  const metadata = user.user_metadata;
  const { data: profileData } = await supabase
    .from('profiles')
    .select('team_id, avatar_url')
    .eq('id', user.id)
    .single();
  
  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      email: user.email,
      meta: { 
        firstName: metadata.firstName, 
        lastName: metadata.lastName,
        teamId: metadata?.role === "captain" ? profileData?.team_id as string : null,
        avatarUrl: profileData?.avatar_url || null,
      },
      role: metadata.role as UserRoleType,
    },
  } as AuthState
})

export const updateUser = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({
    firstName: z.string().max(20),
    lastName: z.string().max(20),
    teamId: z.string().uuid().nullable(),
    avatarUrl: z.string().url().nullable().optional(),
  }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      data: { 
        firstName: data.firstName, 
        lastName: data.lastName,
        teamId: data.teamId,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    // Also update the profile table
    const { data: userData } = await supabase.auth.getUser()

    if (userData.user) {
      const updateData: {
        first_name: string;
        last_name: string;
        updated_at: string;
        avatar_url?: string; 
      } = {
        first_name: data.firstName,
        last_name: data.lastName,
        updated_at: new Date().toISOString(),
      };

      // Include avatar_url in the update if it's provided
      if (data.avatarUrl) {
        updateData.avatar_url = data.avatarUrl;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userData.user.id);

      if (profileError) {
        throw new Error(profileError.message)
      }
    }
  })

export const getUserRole = createServerFn().handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data : { user } } = await supabase.auth.getUser();

  if (user) {
    return user.user_metadata.role as UserRoleType;
  }
})