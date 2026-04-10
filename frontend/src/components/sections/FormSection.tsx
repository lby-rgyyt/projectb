import type { UseFormReturn } from "react-hook-form";
import type { FieldConfig } from "@/config/formConfig";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FormSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  fields: FieldConfig[];
  disabled?: boolean;
  namePrefix?: string;
}

const FormSection = ({
  form,
  fields,
  disabled = false,
  namePrefix,
}: FormSectionProps) => {
  const getFieldName = (name: string) =>
    namePrefix ? `${namePrefix}.${name}` : name;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((fieldConfig) => {
        const fieldName = getFieldName(fieldConfig.name);
        if (fieldConfig.visible && !fieldConfig.visible(form.watch()))
          return null;

        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldConfig.label}
                  {fieldConfig.required && (
                    <span className="text-destructive"> *</span>
                  )}
                </FormLabel>
                <FormControl>
                  {fieldConfig.type === "select" ? (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldConfig.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      {...field}
                      type={fieldConfig.type === "date" ? "date" : "text"}
                      disabled={disabled}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
};

export default FormSection;
