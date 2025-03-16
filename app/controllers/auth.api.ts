import { createServerFn } from "@tanstack/react-start"
import { supabaseServer } from "~/lib/utils/supabase-server"
import {
    AuthState,
    SignInSchema,
    SignUpSchema,
    UserMetaSchema,
} from "../schemas/auth.schema"

export const signUp = createServerFn()
  .validator(SignUpSchema)
  .handler(async ({ data }) => {
    const { data: userData, error } =
      await supabaseServer.auth.signUp({
        email: data.email,
        password: data.password,
      })
    if (error) {
      switch (error.code) {
        case "email_exists":
          throw new Error("Email already exists")
        case "weak_password":
          throw new Error("Your password is too weak")
        default:
          throw new Error(error.message)
      }
    }

    if (userData.user) {
      return userData.user.id
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
      return { error: error.message }
    }
  })

export const signOut = createServerFn().handler(async () => {
  await supabaseServer.auth.signOut()
})

export const getUser = createServerFn().handler<AuthState>(async () => {
  const { data } = await supabaseServer.auth.getUser()

  if (!data.user) {
    return { isAuthenticated: false }
  }

  return {
    isAuthenticated: true,
    user: {
      email: data.user.email,
      meta: { username: data.user.user_metadata.username },
    },
  }
})

export const updateUser = createServerFn()
  .validator(UserMetaSchema)
  .handler(async ({ data }) => {

    const { error } = await supabaseServer.auth.updateUser({
      data: { username: data.username },
    })

    if (error) {
      throw new Error(error.message)
    }
  })