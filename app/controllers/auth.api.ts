import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { supabaseServer } from "~/lib/utils/supabase-server";
import {
  AuthState,
  SignInSchema,
  SignUpSchema,
  UserMetaSchema,
  UserRoleType,
} from "../schemas/auth.schema";
export const signUp = createServerFn()
  .validator(SignUpSchema)
  .handler(async ({ data }) => {
  
    const admin_emails = process.env.ADMIN_EMAILS!;
    const authorized_admin_emails = admin_emails.split(',')
      .map(email => email.trim().toLowerCase()) || [];

    let roleToUse = data.role;
    if (data.role === 'admin' && !authorized_admin_emails.includes(data.email.toLowerCase())) {
      roleToUse = 'player';
    }

    const { error } =
      await supabaseServer.auth.signUp({
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

export const signIn = createServerFn()
  .validator(SignInSchema)
  .handler(async ({ data }) => {
    const { error } = await supabaseServer.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(error.message);
    }
  })

export const signOut = createServerFn().handler(async () => {
  await supabaseServer.auth.signOut()
  redirect({ to: "/" });
})

export const getUser = createServerFn().handler(async () => {
  const { data: { user } } = await supabaseServer.auth.getUser()

  if (!user) {
    return { isAuthenticated: false } as AuthState
  }
  const metadata = user.user_metadata;
  const { data: profileData } = await supabaseServer
    .from('profiles')
    .select('team_id')
    .eq('id', user.id)
    .single();
  
  return {
    isAuthenticated: true,
    user: {
      email: user.email,
      meta: { 
        firstName: metadata.firstName, 
        lastName: metadata.lastName,
        teamId: metadata?.role === "captain" ? profileData?.team_id as string : null,
      },
      role: metadata.role as UserRoleType,
    },
  } as AuthState
})

export const updateUser = createServerFn()
  .validator(UserMetaSchema)
  .handler(async ({ data }) => {
    const { error } = await supabaseServer.auth.updateUser({
      data: { 
        firstName: data.firstName, 
        lastName: data.lastName 
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    // Also update the profile table
    const { data: userData } = await supabaseServer.auth.getUser()
    
    if (userData.user) {
      const { error: profileError } = await supabaseServer
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userData.user.id);

      if (profileError) {
        throw new Error(profileError.message)
      }
    }
  })

export const getUserRole = createServerFn().handler(async () => {
  const { data : { user } } = await supabaseServer.auth.getUser();

  if (user) {
    return user.user_metadata.role as UserRoleType;
  }
})