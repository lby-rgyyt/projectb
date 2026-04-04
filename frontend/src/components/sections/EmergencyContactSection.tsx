import useEditableSection from "../../hooks/useEditableSection";
import SectionHeader from "../SectionHeader";
import { useFieldArray } from "react-hook-form";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

interface EmergencyContactFormData {
  emergencyContacts: {
    firstName: string;
    lastName: string;
    phone: string;
    relationship: string;
    email?: string;
  }[];
}

interface EmergencyContactProps {
  defaultValues: EmergencyContactFormData;
  editable?: boolean;
}

interface EmergencyContactCardProps {
  index: number;
  register: UseFormRegister<EmergencyContactFormData>;
  errors: FieldErrors<EmergencyContactFormData>;
  disabled: boolean;
  onRemove: () => void;
  showRemove: boolean;
}

const EmergencyContactSection = ({
  defaultValues,
  editable = true,
}: EmergencyContactProps) => {
  const { headerProps, register, errors, disabled, control } =
    useEditableSection<EmergencyContactFormData>(defaultValues);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  return (
    <>
      <div>
        <SectionHeader
          title="Employment Contact"
          editable={editable}
          {...headerProps}
        />
      </div>

      {fields.map((field, index) => (
        <EmergencyContactCard
          key={field.id}
          index={index}
          register={register}
          errors={errors}
          disabled={disabled}
          onRemove={() => remove(index)}
          showRemove={fields.length > 1}
        />
      ))}

      {!disabled && (
        <button
          type="button"
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
        </button>
      )}
    </>
  );
};

const EmergencyContactCard = ({
  index,
  register,
  errors,
  disabled,
  onRemove,
  showRemove,
}: EmergencyContactCardProps) => {
  return (
    <div>
      <div>
        <label>First Name *</label>
        <input
          {...register(`emergencyContacts.${index}.firstName`, {
            required: "First name is required.",
          })}
          disabled={disabled}
        />
        {errors.emergencyContacts?.[index]?.firstName && (
          <span>{errors.emergencyContacts[index].firstName.message}</span>
        )}
      </div>
      <div>
        <label>Last Name *</label>
        <input
          {...register(`emergencyContacts.${index}.lastName`, {
            required: "Last name is required.",
          })}
          disabled={disabled}
        />
        {errors.emergencyContacts?.[index]?.lastName && (
          <span>{errors.emergencyContacts[index].lastName.message}</span>
        )}
      </div>
      <div>
        <label>Phone *</label>
        <input
          {...register(`emergencyContacts.${index}.phone`, {
            required: "Phone is required.",
          })}
          disabled={disabled}
        />
        {errors.emergencyContacts?.[index]?.phone && (
          <span>{errors.emergencyContacts[index].phone.message}</span>
        )}
      </div>
      <div>
        <label>Email</label>
        <input
          {...register(`emergencyContacts.${index}.email`)}
          disabled={disabled}
        />
      </div>

      <div>
        <label>Relationship *</label>
        <input
          {...register(`emergencyContacts.${index}.relationship`, {
            required: "Relationship is required.",
          })}
          disabled={disabled}
        />
        {errors.emergencyContacts?.[index]?.relationship && (
          <span>{errors.emergencyContacts[index].relationship.message}</span>
        )}
      </div>
      {showRemove && !disabled && (
        <button type="button" onClick={onRemove}>
          Remove
        </button>
      )}
    </div>
  );
};

export default EmergencyContactSection;
