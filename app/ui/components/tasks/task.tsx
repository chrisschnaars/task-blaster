import { useState } from "react";
import { useCreateSubtask } from "@/app/hooks/useCreateSubtask";
import { useDeleteTask } from "@/app/hooks/useDeleteTask";
import { useToggleTask } from "@/app/hooks/useToggleTask";

import { SvgAdd, SvgEdit, SvgTrash } from "@/app/ui/components/icons";
import { Button } from "../shared/button";
import CreateEditTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import SubtaskForm from "@/app/ui/components/tasks/subtask-form";
import { Task as TaskTypes } from "@/types/global";

interface TaskProps {
  handleUpdateTask: (
    id: string,
    text: string,
    category: string,
    subtasks: string[]
  ) => void;
  task: TaskTypes;
}

export default function Task({ handleUpdateTask, task }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const { id, parentId, text, category, completed, subtasks } = task;

  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: toggleTask } = useToggleTask();

  const onUpdate = (
    id: string,
    text: string,
    category: string,
    subtasks: string[]
  ) => {
    handleUpdateTask(id, text, category, subtasks);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
        <CreateEditTaskForm
          handleUpdateTask={onUpdate}
          onClose={() => setIsEditing(false)}
          task={task}
        />
      ) : (
        <li>
          <div className="group flex items-center py-1 px-2 rounded-lg hover:bg-[var(--color-surface-elevated-2)] hover:shadow-sm">
            <label className="flex gap-2 grow">
              <input
                id-={id}
                name={text}
                type="checkbox"
                checked={completed}
                onChange={() => toggleTask({ id: id, completed: !completed })}
                className="shrink-0 mt-1"
              />
              <span
                className={`text-lg ${
                  completed && "line-through text-[var(--color-text-muted)]"
                }`}
              >
                {text}
              </span>
            </label>
            <div className="flex items-center gap-2">
              {!parentId && (
                <Button
                  ariaLabel="Add sub-task"
                  hidden={true}
                  icon={<SvgAdd />}
                  onClick={() => setShowSubtaskForm(true)}
                  size="xsmall"
                  variant="ghost"
                />
              )}
              <Button
                ariaLabel="Edit task"
                hidden={true}
                icon={<SvgEdit />}
                onClick={() => setIsEditing(true)}
                size="xsmall"
                variant="ghost"
              />

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
                <Task
                  key={subtask.id}
                  handleUpdateTask={handleUpdateTask}
                  task={subtask}
                />
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
