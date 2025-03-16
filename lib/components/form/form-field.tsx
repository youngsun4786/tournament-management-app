import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
interface FormFieldProps {
  id: string;
  label: string;
  field: any;
  text_type?: "text" | "textarea";
  type?: "text" | "email" | "password" | undefined;
  placeholder?: string;
  className: string;
  onChange?: () => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  field,
  text_type = "text",
  type = "text",
  placeholder = "",
  onChange,
  className = "",
}) => {
  const FieldComponent = text_type === "textarea" ? Textarea : Input;

  const handleChange = (value: string) => {
    field.handleChange(value);
    onChange?.();
  };

  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium mb-2 block">
        {label}
      </Label>
      <FieldComponent
        id={id}
        value={field.state.value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={className}
        type={type}
        required
      />
      {field.state.meta.errors && (
        <p className="text-destructive text-sm mt-1">
          {field.state.meta.errors}
        </p>
      )}
    </div>
  );
};
