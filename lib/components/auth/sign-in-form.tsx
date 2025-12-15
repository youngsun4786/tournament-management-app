import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAppForm } from "~/lib/form";
import { signIn } from "~/src/controllers/auth.api";
import { SignInSchema } from "~/src/schemas/auth.schema";
import { FormField } from "../form/form-field";

export const SignInForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const signInMutation = useMutation({
    mutationFn: (data: Parameters<typeof signIn>[0]) => signIn(data),
    onSuccess: async (data) => {
      toast.success("You have successfully signed in.");
      await queryClient.resetQueries();
      await router.invalidate();

      if (data?.user) {
        const role = data.user.role;
        if (role === "captain") {
          await router.navigate({ to: "/edit-teams" });
        } else if (role === "admin") {
          await router.navigate({ to: "/admin" });
        } else {
          await router.navigate({ to: "/" });
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useAppForm({
    defaultValues: {
      username: import.meta.env.VITE_DEFAULT_USER_EMAIL ?? "",
      password: import.meta.env.VITE_DEFAULT_USER_PASSWORD ?? "",
    } as SignInSchema,
    onSubmit: async ({ value }) => {
      try {
        await signInMutation.mutateAsync({ data: value });
      } catch (error) {
        // Error is handled in onError
        console.error("Sign in error:", error);
      }
    },
  });

  return (
    <div className="max-w-md mx-auto w-full p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-xl rounded-none md:rounded-2xl border border-gray-200 transition-all duration-300">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Welcome Back
      </h1>
      <form
        className="flex flex-col gap-2 w-full space-y-2 space-x-2 md:space-x-0 my-4"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.handleSubmit();
          const fieldMeta = form.state.fieldMeta;
          const hasErrors = Object.values(fieldMeta).some(
            (meta) => meta.errors.length > 0
          );
          if (hasErrors) {
            toast.error("Please check your input and try again.");
          }
        }}
      >
        <form.AppField
          name="username"
          children={(field) => (
            <FormField
              id="Username"
              label="Username"
              field={field}
              type="text"
              placeholder="myusername"
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        <form.AppField
          name="password"
          children={(field) => (
            <FormField
              id="Password"
              label="Password"
              type="password"
              field={field}
              placeholder="••••••••••••••••"
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        <form.AppForm>
          <form.SubmitButton label="Sign In" />
        </form.AppForm>
      </form>
    </div>
  );
};
