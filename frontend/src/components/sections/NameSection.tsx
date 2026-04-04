import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import axios from "axios";

interface NameFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  ssn: string;
  dateOfBirth: string;
  gender: string;
  profilePicture?: string;
}

interface NameSectionProps {
  defaultValues: NameFormData;
  email: string;
  editable?: boolean;
  profilePicture?: string;
  onUploadPicture?: (file: File) => void;
}

const NameSection = ({
  defaultValues,
  email,
  editable = true,
  profilePicture,
  onUploadPicture,
}: NameSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NameFormData>({
    defaultValues,
  });

  const disabled = !isEditing;

  // modify it later, needs a real api call, updateEmployeeInfo
  const onSave = async (data: NameFormData) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/employees/update`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsEditing(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.error || "Network error, please try again");
      }
    }
  };

  const onCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div>
      <div>
        <label>Profile Picture</label>
        <img src={profilePicture || "default_avatar.png"} alt="avatar" />
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onUploadPicture) onUploadPicture(file);
            }}
          />
        )}
      </div>

      <div>
        <h3>Name</h3>
        {editable &&
          (isEditing ? (
            <div>
              <button type="button" onClick={onCancel}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit(onSave)}>
                Save
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ))}
      </div>

      <div>
        <label>First Name *</label>
        <input
          {...register("firstName", { required: "First name is required." })}
          disabled={disabled}
        />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <label>Last Name *</label>
        <input
          {...register("lastName", { required: "Last name is required." })}
          disabled={disabled}
        />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div>
        <label>Middle Name</label>
        <input {...register("middleName")} disabled={disabled} />
      </div>

      <div>
        <label>Preferred Name</label>
        <input {...register("preferredName")} disabled={disabled} />
      </div>

      <div>
        <label>Email</label>
        <input value={email} disabled />
      </div>

      <div>
        <label>SSN *</label>
        <input
          {...register("ssn", { required: "SSN is required." })}
          disabled={disabled}
        />
        {errors.ssn && <span>{errors.ssn.message}</span>}
      </div>

      <div>
        <label>Date of Birth *</label>
        <input
          type="date"
          {...register("dateOfBirth", {
            required: "Date of birth is required.",
          })}
          disabled={disabled}
        />
        {errors.dateOfBirth && <span>{errors.dateOfBirth.message}</span>}
      </div>

      <div>
        <label>Gender *</label>
        <select
          {...register("gender", { required: "Gender is required." })}
          disabled={disabled}
        >
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="I do not wish to answer">
            I do not wish to answer
          </option>
        </select>
        {errors.gender && <span>{errors.gender.message}</span>}
      </div>
    </div>
  );
};

export default NameSection;
