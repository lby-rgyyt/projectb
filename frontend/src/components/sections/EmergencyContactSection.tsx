import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  emergencyContactSchema,
  emergencyContactFields,
} from "@/config/formConfig";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormSection from "./FormSection";
import api from "@/utils/api";
import { handleError } from "@/utils/error";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

const sectionSchema = z.object({
  emergencyContacts: z.array(emergencyContactSchema).min(1),
});

interface EditableProps {
  defaultValues: FieldValues;
  editable?: boolean;
}

interface EmbeddedProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  disabled?: boolean;
}

type EmergencyContactSectionProps = EditableProps | EmbeddedProps;

// use this to determine whether it is used by onboarding/personal
const isEmbedded = (
  props: EmergencyContactSectionProps,
): props is EmbeddedProps => "form" in props;

const EmergencyContactSection = (props: EmergencyContactSectionProps) => {
  if (isEmbedded(props)) {
    return (
      <EmergencyContactFields form={props.form} disabled={props.disabled} />
    );
  }
  return <EditableEmergencyContacts {...props} />;
};

// OnboardingApplication, just rendering
const EmergencyContactFields = ({
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

// PersonalInfo, Edit/Save/Cancel
const EditableEmergencyContacts = ({
  defaultValues,
  editable = true,
}: EditableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(sectionSchema) as any,
    defaultValues,
  });

  const { isDirty, isSubmitting } = form.formState;

  const onSave = async (data: FieldValues) => {
    try {
      await api.put("/api/employees/update", data);
      setIsEditing(false);
      form.reset(data);
    } catch (err) {
      handleError(err);
    }
  };

  const onDiscard = () => {
    form.reset();
    setIsEditing(false);
    setDiscardOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Emergency Contacts</CardTitle>
          {editable && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={form.handleSubmit(onSave)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (isDirty) {
                        setDiscardOpen(true);
                      } else {
                        setIsEditing(false);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <EmergencyContactFields form={form} disabled={!isEditing} />
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to discard all changes?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will discard all your changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDiscard}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmergencyContactSection;
