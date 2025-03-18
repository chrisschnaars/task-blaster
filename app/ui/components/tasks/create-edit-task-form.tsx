import { useEffect, useRef, useState } from "react";
import { SvgAdd, SvgClose } from "@/app/ui/components/icons";
import { Button } from "@/app/ui/components/shared/button";
import Select from "@/app/ui/components/shared/select";
import { Task } from "@/types/global";
import { useCreateTask } from "@/app/hooks/useCreateTask"; // Import the custom hook

interface CreateEditTaskForm {
  defaultCategory?: string;
  handleCreateTask?: (
    text: string,
    category: string,
    subtasks: string[]
  ) => void;
  handleUpdateTask?: (
    id: string,
    text: string,
    category: string,
    subtasks: string[]
  ) => void;
  onClose: () => void;
  task?: Task;
}

export default function CreateEditTaskForm({
  defaultCategory = "now",
  handleCreateTask,
  handleUpdateTask,
  onClose,
  task,
}: CreateEditTaskForm) {
  const { mutate: createTask, isPending } = useCreateTask();
  const [parentText, setParentText] = useState(task ? task.text : "");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [category, setCategory] = useState(
    task ? task.category : defaultCategory
  );
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const taskInputRef = useRef(null);
  const submitButtonRef = useRef(null);

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

  useEffect(() => {
    if (!showSubtaskForm && subtasks.length > 0) {
      submitButtonRef.current?.focus();
    }
  }, [showSubtaskForm, subtasks.length]);

  // Clean out empty subtasks
  const removeEmptySubtasks = (taskArray: string[]) => {
    const cleanedSubtasks = taskArray.filter((s) => s.trim() !== "");
    return cleanedSubtasks;
  };

  // Handles keypress when in the task form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSubtask();
    }
  };

  // Saves any substasks when user presses Save subtasks buttons
  const saveSubtasks = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newSubtask.trim() !== "") {
      addSubtask();
    }

    setShowSubtaskForm(false);
  };

  // Adds the subtask to the array
  const addSubtask = () => {
    if (newSubtask.trim() === "") return;
    setSubtasks([...subtasks, newSubtask]);
    setNewSubtask("");
  };

  // Remove subtask if user removes focus with empty field
  const handleSubtaskBlur = (index: number) => {
    if (subtasks[index].trim() === "") {
      setSubtasks(subtasks.filter((_, i) => i !== index)); // Remove empty subtasks
    }
  };

  const updateSubtask = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const removeSubtask = (index: number) => {
    if (subtasks.length === 1) return; // Prevent deleting the last field
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: better error handling
    if (!parentText.trim()) return;

    // Remove empty sub-tasks
    const cleanedSubtasks = removeEmptySubtasks(subtasks);

    if (task) {
      handleUpdateTask(task.id, parentText, category, cleanedSubtasks);
    } else {
      createTask({
        text: parentText,
        category: category,
        subtasks: cleanedSubtasks,
      });
    }

    setParentText("");
    setSubtasks([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg overflow-hidden"
    >
      <input
        ref={taskInputRef}
        autoFocus
        className="bg-transparent text-medium px-3 py-2 w-full focus-visible:!outline-none"
        onChange={(e) => setParentText(e.target.value)}
        placeholder="Add task..."
        type="text"
        value={parentText}
        required
      />

      {/* Sub-task */}
      {showSubtaskForm || subtasks.length > 0 ? (
        <div className="px-3 pt-2 pb-3">
          <div className="bg-[var(--color-surface-elevated-2)] border border-[var(--color-border)] rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
              <div className="text-sm font-medium">Subtasks</div>
              {!showSubtaskForm && (
                <Button
                  onClick={() => setShowSubtaskForm(true)}
                  type="button"
                  size="xsmall"
                  variant="secondary"
                >
                  Add subtask
                </Button>
              )}
            </div>

            {subtasks.map((subtask, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 min-h-[44px]"
              >
                <input
                  type="text"
                  value={subtask}
                  placeholder="Enter subtask"
                  onChange={(e) => updateSubtask(index, e.target.value)}
                  className="bg-transparent text-medium w-full focus-visible:!outline-none"
                  onBlur={() => handleSubtaskBlur(index)}
                />
                <Button
                  onClick={() => removeSubtask(index)}
                  ariaLabel="Remove subtask"
                  type="button"
                  icon={<SvgClose />}
                  size="small"
                  variant="ghost"
                />
              </div>
            ))}

            {showSubtaskForm && (
              <>
                <div className="flex gap-2 px-3 py-2 min-h-[44px]">
                  <input
                    autoFocus
                    type="text"
                    value={newSubtask}
                    placeholder="Enter subtask"
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    className="bg-transparent text-medium w-full focus-visible:!outline-none"
                  />
                </div>
                <div className="flex gap-2 items-center justify-end px-3 py-2">
                  <Button
                    onClick={() => setShowSubtaskForm(false)}
                    type="button"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => saveSubtasks(e)}
                    type="button"
                    variant="primary"
                  >
                    Save subtask{subtasks.length > 1 && "s"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-2">
          <Button
            onClick={() => setShowSubtaskForm(true)}
            icon={<SvgAdd />}
            type="button"
            variant="secondary"
            size="small"
          >
            Add sub-task
          </Button>
        </div>
      )}

      {/* Actions */}
      {!showSubtaskForm && (
        <div className="flex items-center gap-4 justify-between px-3 py-2 border-t border-[var(--color-border)]">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 bg-gray-100 border px-2 rounded-md"
          >
            <option value="now">Now</option>
            <option value="soon">Soon</option>
            <option value="later">Later</option>
          </Select>
          <div className="flex gap-2 items-center justify-end">
            <Button onClick={onClose} type="button" variant="secondary">
              Cancel
            </Button>
            <Button ref={submitButtonRef} type="submit" variant="primary">{`${
              task ? "Update" : "Add"
            } task`}</Button>
          </div>
        </div>
      )}
    </form>
  );
}
