interface SectionHeaderProps {
  title: string;
  editable: boolean;
  isEditing: boolean;
  isSubmitting:boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const SectionHeader = ({
  title,
  editable,
  isEditing,
  isSubmitting,
  onEdit,
  onCancel,
  onSave,
}: SectionHeaderProps) => (
  <div>
    <h3>{title}</h3>
    {editable &&
      (isEditing ? (
        <div>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={onSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving...":"Save"}
          </button>
        </div>
      ) : (
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      ))}
  </div>
);

export default SectionHeader;
