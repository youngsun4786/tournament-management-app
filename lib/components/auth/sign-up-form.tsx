import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { signUp } from "~/app/controllers/auth.api";
import { useGetTeams } from "~/app/queries";
import { SignUpSchema, UserRoleType } from "~/app/schemas/auth.schema";
import { Label } from "~/lib/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/lib/components/ui/select";
import { useAppForm } from "~/lib/form";
import { FormField } from "../form/form-field";

export const SignUpForm = () => {
  const router = useRouter();
  const [showTeamSelect, setShowTeamSelect] = useState(false);
  const { data: teamsData, isLoading, isError } = useGetTeams();
  const teams = teamsData?.filter((team) => team.name !== "TBD");

  const signUpMutation = useMutation({
    mutationFn: (data: Parameters<typeof signUp>[0]) => signUp(data),
    onSuccess: () => {
      router.invalidate();
      toast.success("Confirmation email sent. Please check your email.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "captain" as UserRoleType,
      teamId: "",
    } as SignUpSchema,
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync({
        data: { ...value },
      });
    },
  });

  // Simplified approach - set teamId to empty string when role changes and it's not captain
  const handleRoleChange = (
    value: UserRoleType,
    field: { handleChange: (value: UserRoleType) => void }
  ) => {
    field.handleChange(value);
    setShowTeamSelect(value === "captain");
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 md:p-8 shadow-input bg-white dark:bg-black shadow-xl rounded-none md:rounded-2xl border border-gray-200 transition-all duration-300">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Join CCBC
      </h1>
      <form
        className="flex flex-col w-full gap-2 space-y-2 space-x-2 md:space-x-0 my-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
          <form.AppField
            name="firstName"
            validators={{ onChangeAsyncDebounceMs: 500 }}
            children={(field) => (
              <>
                <FormField
                  id="firstName"
                  label="First Name"
                  field={field}
                  className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                />
                <p>{field.state.meta.errorMap.onChange}</p>
              </>
            )}
          />
          <form.AppField
            name="lastName"
            validators={{ onChangeAsyncDebounceMs: 500 }}
            children={(field) => (
              <FormField
                id="lastName"
                label="Last Name"
                field={field}
                className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
        </div>
        <form.AppField
          name="email"
          validators={{ onChangeAsyncDebounceMs: 500 }}
          children={(field) => (
            <FormField
              id="Email"
              label="Email"
              field={field}
              type="email"
              placeholder="myemail@gmail.com"
              className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        <form.AppField
          name="password"
          validators={{ onChangeAsyncDebounceMs: 500 }}
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
        <form.AppField
          name="confirmPassword"
          validators={{ onChangeAsyncDebounceMs: 500 }}
          children={(field) => (
            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              field={field}
              placeholder="••••••••••••••••"
              className="mb-4 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
            />
          )}
        />
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="role">Select Role</Label>
          <form.Field name="role">
            {(field) => (
              <>
                <Select
                  onValueChange={(value) =>
                    handleRoleChange(value as UserRoleType, field)
                  }
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="captain">Captain</SelectItem>
                    <SelectItem value="score-keeper">Score Keeper</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </form.Field>
        </div>

        {showTeamSelect && (
          <div className="flex flex-col space-y-1.5 mt-4">
            <Label htmlFor="teamId">Select Your Team</Label>
            <form.Field name="teamId">
              {(field) => (
                <>
                  <Select
                    defaultValue={field.state.value || ""}
                    onValueChange={(value) => {
                      if (value) {
                        field.handleChange(value);
                      }
                    }}
                  >
                    <SelectTrigger id="teamId" className="w-full">
                      <SelectValue placeholder="Select your team" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="" disabled>
                          Loading...
                        </SelectItem>
                      ) : isError ? (
                        <SelectItem value="" disabled>
                          Error loading teams
                        </SelectItem>
                      ) : (
                        teams?.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errorMap.onChange && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errorMap.onChange}
                    </p>
                  )}
                </>
              )}
            </form.Field>
          </div>
        )}

        <form.AppForm>
          <form.SubmitButton label="Sign Up" />
        </form.AppForm>
      </form>
    </div>
  );
};
