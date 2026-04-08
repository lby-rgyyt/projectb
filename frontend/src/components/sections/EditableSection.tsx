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

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSave = async (data: FieldValues) => {
    try {
      await api.put("/api/employees/update", data);
      setIsEditing(false);
    } catch (err) {
      handleError(err);
    }
  };

  const onCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
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
                <Button size="sm" variant="outline" onClick={onCancel}>
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
  );
};

export default EditableSection;
