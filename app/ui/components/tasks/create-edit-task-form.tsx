import { useEffect, useRef, useState } from "react";

import { SvgClose } from "@/app/ui/components/icons";
import { Button } from "@/app/ui/components/shared/button";
import Select from "@/app/ui/components/shared/select";

import { useCreateTask } from "@/app/hooks/useCreateTask";
import { useUpdateTask } from "@/app/hooks/useUpdateTask";

import { Task } from "@/types/global";

interface CreateEditTaskForm {
  onClose: () => void;
  task?: Task; // optional task to edit
}

export default function CreateEditTaskForm({
  onClose,
  task,
}: CreateEditTaskForm) {
  const [parentText, setParentText] = useState(task ? task.text : "");
  const [subtasks, setSubtasks] = useState<Task[]>(task?.subtasks ?? []);
  const [newSubtask, setNewSubtask] = useState("");
  const [category, setCategory] = useState(task ? task.category : "now");

  const taskInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate: createTask, isPending } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

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

  // Clean out empty subtasks
  const removeEmptySubtasks = (taskArray: Task[]) => {
    const cleanedSubtasks = taskArray.filter((s) => s.text.trim() !== "");
    return cleanedSubtasks;
  };

  // Handles keypress when in the task form
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target === taskInputRef.current) {
        // If we're in the main task input, submit the form
        submitButtonRef.current?.click();
      } else {
        // If we're in a subtask input, add the subtask
        addSubtask();
      }
    }
  };

  // Saves any substasks
  const saveSubtask = () => {
    if (newSubtask.trim() !== "") {
      addSubtask();
    }
  };

  // Adds the subtask to the array
  const addSubtask = () => {
    if (newSubtask.trim() === "") return;
    setSubtasks([
      ...subtasks,
      {
        id: `temp-${Date.now()}`,
        text: newSubtask,
        category: category,
        completed: false,
        parentId: task?.id ?? "",
        subtasks: [],
      },
    ]);
    setNewSubtask("");
  };

  // Remove subtask if user removes focus with empty field
  const removeEmptySubtask = (index: number) => {
    if (subtasks[index].text.trim() === "") {
      setSubtasks(subtasks.filter((_, i) => i !== index)); // Remove empty subtasks
    }
  };

  const updateSubtask = (index: number, value: string) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = { ...newSubtasks[index], text: value };
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
      // When updating, preserve the existing subtask structure
      updateTask({
        id: task.id,
        text: parentText,
        category: category,
        subtasks: cleanedSubtasks.map((subtask) => ({
          text: subtask.text,
          category: subtask.category,
          completed: subtask.completed,
          parentId: subtask.parentId,
        })),
      });
    } else {
      // When creating, convert subtasks to simple format
      createTask({
        text: parentText,
        category: category,
        subtasks: cleanedSubtasks.map((subtask) => ({
          text: subtask.text,
          completed: false,
          parentId: null,
        })),
      });
    }

    onClose();
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
        onKeyDown={handleKeyDown}
        required
      />

      {/* Sub-task */}
      <div className="px-3 pt-2 pb-3">
        <div className="bg-[var(--color-surface-elevated-2)] border border-[var(--color-border)] rounded-lg">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
            <div className="text-sm font-medium">Subtasks</div>
          </div>

          {subtasks.map((subtask, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 min-h-[44px]"
            >
              <input
                type="text"
                value={subtask.text}
                placeholder="Enter subtask"
                onChange={(e) => updateSubtask(index, e.target.value)}
                className="bg-transparent text-medium w-full focus-visible:!outline-none"
                onBlur={() => removeEmptySubtask(index)}
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

          <div className="flex gap-2 px-3 py-2 min-h-[44px]">
            <input
              type="text"
              value={newSubtask}
              placeholder="Enter subtask"
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => saveSubtask()}
              className="bg-transparent text-medium w-full focus-visible:!outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
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
    </form>
  );
}
