import { useEffect, useState } from "react";
import { useCreateSubtask } from "@/app/hooks/useCreateSubtask";

interface SubtaskFormProps {
  category: string;
  onClose: () => void;
  parentId: string;
}

export default function SubtaskForm({
  category,
  onClose,
  parentId,
}: SubtaskFormProps) {
  const [subtaskText, setSubtaskText] = useState("");
  const { mutate: createSubtask } = useCreateSubtask();

  // Handle Escape key to close form
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      saveSubtask();
    }
  };

  const saveSubtask = () => {
    if (subtaskText.trim() !== "") {
      createSubtask({
        category: category,
        parentId: parentId,
        text: subtaskText.trim(),
      });

      setSubtaskText("");
    } else {
      onClose();
    }
  };

  return (
    <div className="pl-[var(--space-subtask-offset)]">
      <div className="py-1 px-2 flex items-center gap-2">
        <span className="h-5 w-5 bg-gray-200"></span>
        <input
          type="text"
          className="grow bg-transparent text-medium text-lg focus-visible:!outline-none"
          autoFocus
          value={subtaskText}
          onChange={(e) => setSubtaskText(e.target.value)}
          onBlur={saveSubtask}
          onKeyDown={(e) => handleKeyDown(e)}
          placeholder="Enter subtask"
        />
      </div>
    </div>
  );
}
