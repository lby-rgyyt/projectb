import useEditableSection from "../../hooks/useEditableSection";
import SectionHeader from "../SectionHeader";

interface EmploymentFormData {
  visaType: string;
  visaTitle?: string;
  visaStartDate?: string;
  visaEndDate?: string;
}

interface EmploymentProps {
  defaultValues: EmploymentFormData;
  editable?: boolean;
}

const EmploymentSection = ({
  defaultValues,
  editable = true,
}: EmploymentProps) => {
  const { headerProps, register, errors, disabled, watch } =
    useEditableSection<EmploymentFormData>(defaultValues);
  const visaType = watch("visaType");

  return (
    <div>
      <div>
        <SectionHeader
          title="Employment"
          editable={editable}
          {...headerProps}
        />
      </div>

      <div>
        <label>Visa Type *</label>
        <select
          {...register("visaType", { required: "Visa Type is required." })}
          disabled={disabled}
        >
          <option value="">Select...</option>
          <option value="Citizen">Citizen</option>
          <option value="Green Card">Green Card</option>
          <option value="H1-B">H1-B</option>
          <option value="L2">L2</option>
          <option value="F1(CPT/OPT)">F1(CPT/OPT)</option>
          <option value="H4">H4</option>
          <option value="Other">Other</option>
        </select>
        {errors.visaType && <span>{errors.visaType.message}</span>}
      </div>

      {visaType === "Other" && (
        <div>
          <label>Visa Title *</label>
          <input
            {...register("visaTitle", {
              required:
                visaType === "Other" ? "Visa title is required." : false,
            })}
            disabled={disabled}
          />
          {errors.visaTitle && <span>{errors.visaTitle.message}</span>}
        </div>
      )}

      {!(visaType === "Green Card" || visaType === "Citizen") && (
        <>
          <div>
            <label>Start Date</label>
            <input
              type="date"
              {...register("visaStartDate")}
              disabled={disabled}
            />
            {errors.visaStartDate && (
              <span>{errors.visaStartDate.message}</span>
            )}
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              {...register("visaEndDate")}
              disabled={disabled}
            />
            {errors.visaEndDate && <span>{errors.visaEndDate.message}</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default EmploymentSection;
