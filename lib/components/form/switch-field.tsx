import React from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface SwitchFieldProps {
  id: string;
  label: string;
  field: any;
  className?: string;
  onChange?: () => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  id,
  label,
  field,
  onChange,
  className = "",
}) => {
  const handleChange = (checked: boolean) => {
    field.handleChange(checked);
    onChange?.();
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Switch
        id={id}
        checked={Boolean(field.state.value)}
        onCheckedChange={handleChange}
        className={className}
      />
      {field.state.meta.errors && (
        <p className="text-destructive text-sm mt-1">
          {field.state.meta.errors}
        </p>
      )}
    </div>
  );
};
