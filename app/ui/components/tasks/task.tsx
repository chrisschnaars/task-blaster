import { useState } from "react";
import { useCreateSubtask } from "@/app/hooks/useCreateSubtask";
import { useDeleteTask } from "@/app/hooks/useDeleteTask";
import { useToggleTask } from "@/app/hooks/useToggleTask";
import { useUpdateTask } from "@/app/hooks/useUpdateTask";

import { SvgAdd, SvgEdit, SvgTrash } from "@/app/ui/components/icons";
import { Button } from "../shared/button";
import CreateEditTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import SubtaskForm from "@/app/ui/components/tasks/subtask-form";
import { Task as TaskTypes } from "@/types/global";

interface TaskProps {
  task: TaskTypes;
}

export default function Task({ task }: TaskProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const { id, parentId, text, category, completed, subtasks } = task;

  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: toggleTask } = useToggleTask();
  const { mutate: updateTask } = useUpdateTask();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    if (editedText.trim() !== text) {
      updateTask({
        id: id,
        text: editedText,
        category: category,
        subtasks: [],
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditedText(text);
      setIsEditing(false);
    }
  };

  return (
    <>
      {showEditForm ? (
        <CreateEditTaskForm onClose={() => setIsEditing(false)} task={task} />
      ) : (
        <li>
          <div className="group flex items-center py-1 px-2 rounded-lg hover:bg-[var(--color-surface-elevated-2)] hover:shadow-sm">
            <div className="flex gap-2 grow">
              <input
                id-={id}
                name={text}
                type="checkbox"
                checked={completed}
                onChange={() => toggleTask({ id: id, completed: !completed })}
                className="shrink-0 mt-1"
              />
              {isEditing ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={handleTextChange}
                  onBlur={handleTextBlur}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-lg w-full focus-visible:!outline-none"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => setIsEditing(true)}
                  className={`text-lg cursor-pointer ${
                    completed && "line-through text-[var(--color-text-muted)]"
                  }`}
                >
                  {text}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!parentId && (
                <>
                  <Button
                    ariaLabel="Add sub-task"
                    hidden={true}
                    icon={<SvgAdd />}
                    onClick={() => setShowSubtaskForm(true)}
                    size="xsmall"
                    variant="ghost"
                  />
                  <Button
                    ariaLabel="Edit task"
                    hidden={true}
                    icon={<SvgEdit />}
                    onClick={() => setShowEditForm(true)}
                    size="xsmall"
                    variant="ghost"
                  />
                </>
              )}
              <Button
                ariaLabel="Delete task"
                hidden={true}
                icon={<SvgTrash />}
                onClick={() =>
                  deleteTask({ id: task.id, parentId: task.parentId })
                }
                size="xsmall"
                variant="ghost"
              />
            </div>
          </div>

          {/* Sub-tasks */}
          {subtasks && subtasks.length > 0 && (
            <ul className="pl-[var(--space-subtask-offset)]">
              {subtasks.map((subtask) => (
                <Task key={subtask.id} task={subtask} />
              ))}
            </ul>
          )}

          {/* Inline task form */}
          {!parentId && showSubtaskForm && (
            <SubtaskForm
              category={category}
              onClose={() => setShowSubtaskForm(false)}
              parentId={id}
            />
          )}
        </li>
      )}
    </>
  );
}
