import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AdditionalNameSectionProps {
  email: string;
  profilePicture?: string;
  onUploadPicture?: (file: File) => Promise<void>;
  disabled: boolean;
}

const AdditionalNameSection = ({
  email,
  profilePicture,
  onUploadPicture,
  disabled,
}: AdditionalNameSectionProps) => {
  return (
    <>
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
        {!disabled && onUploadPicture && (
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
    </>
  );
};

export default AdditionalNameSection;
