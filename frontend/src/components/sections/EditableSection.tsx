import { useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import type { FieldConfig } from "@/config/formConfig";
import { zodResolver } from "@hookform/resolvers/zod";
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

interface EditableSectionProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: any;
  fields: FieldConfig[];
  defaultValues: FieldValues;
  editable?: boolean;
  namePrefix?: string;
}

const EditableSection = ({
  title,
  schema,
  fields,
  defaultValues,
  editable = true,
  namePrefix,
}: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSave = async (data: FieldValues) => {
    try {
      await api.put("/api/employees/update", data);
      form.reset(data);
      setIsEditing(false);
    } catch (err) {
      handleError(err);
    }
  };

  const onDiscard = () => {
    form.reset(defaultValues);
    setIsEditing(false);
    setDiscardOpen(false);
  };

  return (
    <>
      {" "}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {editable && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={form.handleSubmit(onSave)}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (form.formState.isDirty) {
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
            <FormSection
              form={form}
              fields={fields}
              disabled={!isEditing}
              namePrefix={namePrefix}
            />
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent >
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

export default EditableSection;
