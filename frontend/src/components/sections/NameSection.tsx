import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues } from "react-hook-form";
import { nameSchema, nameFields } from "@/config/formConfig";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "./FormSection";
import api from "@/utils/api";
import { handleError } from "@/utils/error";

interface NameSectionProps {
  defaultValues: FieldValues;
  email: string;
  editable?: boolean;
  profilePicture?: string;
  onUploadPicture?: (file: File) => Promise<void>;
}

const NameSection = ({
  defaultValues,
  email,
  editable = true,
  profilePicture,
  onUploadPicture,
}: NameSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(nameSchema) as any,
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
        <CardTitle>Name</CardTitle>
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
      <CardContent className="flex flex-col gap-6">
        {/* profile picture */}
        <fieldset className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                profilePicture
                  ? `${import.meta.env.VITE_API_URL}/${profilePicture}`
                  : `${import.meta.env.VITE_API_URL}/public/avatars/default_avatar.png`
              }
              alt="avatar"
            />
            <AvatarFallback>N/A</AvatarFallback>
          </Avatar>
          {isEditing && onUploadPicture && (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadPicture(file);
              }}
            />
          )}
        </fieldset>

        {/* Email, readonly */}
        <fieldset>
          <Label>Email</Label>
          <Input value={email} disabled />
        </fieldset>

        {/* resue FormSection */}
        <Form {...form}>
          <FormSection form={form} fields={nameFields} disabled={!isEditing} />
        </Form>
      </CardContent>
    </Card>
  );
};

export default NameSection;
