import { useState } from "react";
import { useForm } from "react-hook-form";
import type { DefaultValues, FieldValues } from "react-hook-form";
import api from "../utils/api";

// const useEditableSection = <T extends Record<string, any>>(
//   defaultValues: T,
// ) => {
const useEditableSection = <T extends FieldValues>(
  defaultValues: DefaultValues<T>,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<T>({ defaultValues });
  const onSave = async (data: T) => {
    try {
      await api.put("/api/employees/update", data);
      setIsEditing(false);
    } catch {
      alert("Update failed");
    }
  };
  const onCancel = () => {
    reset();
    setIsEditing(false);
  };
  //   return {
  //     isEditing,
  //     setIsEditing,
  //     register,
  //     errors,
  //     isSubmitting,
  //     handleSubmit,
  //     onSave,
  //     onCancel,
  //   };
  return {
    headerProps: {
      isEditing,
      isSubmitting,
      onCancel,
      onSave: handleSubmit(onSave),
      onEdit: () => setIsEditing(true),
    },
    register,
    errors,
    disabled:!isEditing,
  };
};

export default useEditableSection;
