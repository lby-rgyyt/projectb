import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  defaultValues: FieldValues;
  editable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderContent: (form: UseFormReturn<any>, disabled: boolean) => ReactNode;
}

const EditableSection = ({
  title,
  schema,
  defaultValues,
  editable = true,
  renderContent
}: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { isDirty, isSubmitting } = form.formState;

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
    form.reset();
    setIsEditing(false);
    setDiscardOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>{title}</CardTitle>
          {editable && (
            <section className="flex gap-2">
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
            </section>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {/* <FormSection
              form={form}
              fields={fields}
              disabled={!isEditing}
              namePrefix={namePrefix}
            /> */}
            {renderContent(form, !isEditing)}
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

export default EditableSection;
