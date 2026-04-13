import { useFieldArray } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { emergencyContactFields } from "@/config/formConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormSection from "./FormSection";

// OnboardingApplication, just rendering
export const EmergencyContactFields = ({
  form,
  disabled = false,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  disabled?: boolean;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emergencyContacts",
  });

  return (
    <section className="flex flex-col gap-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Emergency Contact #{index + 1}</CardTitle>
            {fields.length > 1 && !disabled && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <FormSection
              form={form}
              fields={emergencyContactFields}
              namePrefix={`emergencyContacts.${index}`}
              disabled={disabled}
            />
          </CardContent>
        </Card>
      ))}
      {!disabled && (
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
              relationship: "",
            })
          }
        >
          + Add Another Emergency Contact
        </Button>
      )}
    </section>
  );
};

export default EmergencyContactFields;
