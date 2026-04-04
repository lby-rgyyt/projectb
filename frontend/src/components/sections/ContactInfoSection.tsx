import useEditableSection from "../../hooks/useEditableSection";
import SectionHeader from "../SectionHeader";

interface ContactInfoFormData {
  cellPhone: string;
  workPhone?: string;
}

interface ContactInfoSectionProps {
  defaultValues: ContactInfoFormData;
  editable?: boolean;
}

const ContactInfoSection = ({
  defaultValues,
  editable = true,
}: ContactInfoSectionProps) => {
  const {
    isEditing,
    setIsEditing,
    register,
    errors,
    handleSubmit,
    onSave,
    onCancel,
  } = useEditableSection<ContactInfoFormData>(defaultValues);

  const disabled = !isEditing;

  return (
    <div>
      <div>
        <SectionHeader
          title="Contact Info"
          editable={editable}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={onCancel}
          onSave={handleSubmit(onSave)}
        />
      </div>

      <div>
        <label>Cell Phone *</label>
        <input
          {...register("cellPhone", {
            required: "Cell phone is required.",
          })}
          disabled={disabled}
        />
        {errors.cellPhone && <span>{errors.cellPhone.message}</span>}
      </div>

      <div>
        <label>Work Phone</label>
        <input {...register("workPhone")} disabled={disabled} />
      </div>
    </div>
  );
};

export default ContactInfoSection;
