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

    const { data: userData, error } =
      await supabaseServer.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            role: roleToUse,
          }
        }
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

    if (userData.user) {
      // Create profile record
      const profileData: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        team_id?: string;
      } = {
        id: userData.user.id,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
      };
      
      // Add team_id if role is captain
      if (roleToUse === 'captain' && data.teamId) {
        profileData.team_id = data.teamId;
      }
      
      const { error: profileError } = await supabaseServer
        .from('profiles')
        .insert(profileData);
      
      if (profileError) {
        throw new Error(profileError.message);
      }

      // Assign role to user
      const { error: roleError } = await supabaseServer
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: roleToUse,
        });

      if (roleError) {
        throw new Error(roleError.message);
      }

      return userData.user.id;
    }

    throw new Error("Something went wrong")
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
      role: metadata?.role as UserRoleType,
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
  const { data } = await supabaseServer.auth.getUser()

  if (!data.user) {
    return null;
  }

  const { data: roleData } = await supabaseServer
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id)
    .single();

  return roleData?.role as UserRoleType;
})