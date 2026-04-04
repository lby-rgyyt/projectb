import useEditableSection from "../../hooks/useEditableSection";
import SectionHeader from "../SectionHeader";

interface AddressFormData {
  address: {
    building?: string;
    streetName: string;
    city: string;
    state: string;
    zip: string;
  };
}

interface AddressSectionProps {
  defaultValues: AddressFormData;
  editable?: boolean;
}

const AddressSection = ({
  defaultValues,
  editable = true,
}: AddressSectionProps) => {
  const {
    headerProps,
    register,
    errors,
    disabled,
  } = useEditableSection<AddressFormData>(defaultValues);


  return (
    <div>
      <div>
        <SectionHeader
          title="Address"
          editable={editable}
          {...headerProps}
        />
      </div>

      <div>
        <label>Building/Apt #</label>
        <input {...register("address.building")} disabled={disabled} />
      </div>

      <div>
        <label>Street Name *</label>
        <input
          {...register("address.streetName", {
            required: "Street name is required.",
          })}
          disabled={disabled}
        />
        {errors.address?.streetName && (
          <span>{errors.address.streetName.message}</span>
        )}
      </div>

      <div>
        <label>City *</label>
        <input
          {...register("address.city", { required: "City is required." })}
          disabled={disabled}
        />
        {errors.address?.city && <span>{errors.address.city.message}</span>}
      </div>

      <div>
        <label>State *</label>
        <input
          {...register("address.state", { required: "State is required." })}
          disabled={disabled}
        />
        {errors.address?.state && <span>{errors.address.state.message}</span>}
      </div>

      <div>
        <label>Zip *</label>
        <input
          {...register("address.zip", { required: "Zip is required." })}
          disabled={disabled}
        />
        {errors.address?.zip && <span>{errors.address.zip.message}</span>}
      </div>
    </div>
  );
};

export default AddressSection;
