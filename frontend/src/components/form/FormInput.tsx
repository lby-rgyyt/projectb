import type { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormInput = ({
  form,
  name,
  label,
  type = "text",
  placeholder,
  disabled,
}: FormInputProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label.endsWith("*") ? (
            <>
              {label.slice(0, -1)}
              <span className="text-destructive">*</span>
            </>
          ) : (
            label
          )}
        </FormLabel>
        <FormControl>
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormInput;
