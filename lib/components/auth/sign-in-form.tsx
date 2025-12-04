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
    onSuccess: () => {
      toast.success("You have successfully signed in.");
      queryClient.resetQueries();
      router.invalidate();
    },
  });

  const form = useAppForm({
    defaultValues: {
      username: process.env.VITE_DEFAULT_USER_EMAIL ?? "",
      password: process.env.VITE_DEFAULT_USER_PASSWORD ?? "",
    } as SignInSchema,
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync({ data: value });
    },
  });

  return (
    <div className="max-w-md mx-auto w-full p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-xl rounded-none md:rounded-2xl border border-gray-200 transition-all duration-300">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Welcome Back
      </h1>
      <form
        className="flex flex-col gap-2 w-full space-y-2 space-x-2 md:space-x-0 my-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
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
