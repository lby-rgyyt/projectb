interface SectionHeaderProps {
  title: string;
  editable: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const SectionHeader = ({
  title,
  editable,
  isEditing,
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
          <button type="button" onClick={onSave}>
            Save
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
