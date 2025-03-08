import { useState } from "react";

import { SvgAdd, SvgEdit, SvgTrash } from "@/app/ui/components/icons";
import { Button } from "../shared/button";
import CreateEditTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import { Task as TaskTypes } from "@/types/global";

interface TaskProps {
  handleDeleteTask: (taskId: string, parentId: string | null) => void;
  handleToggleTask: (id: string, parentId: string | null, completed: boolean) => void;
  handleUpdateTask: (id: string, text: string, category: string, subtasks: string[]) => void;
  task: TaskTypes;
}

export default function Task({ handleToggleTask, handleDeleteTask, handleUpdateTask, task }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { id, parentId, text, completed, subtasks } = task;

  const onUpdate = (id: string, text: string, category: string, subtasks: string[]) => {
    handleUpdateTask(id, text, category, subtasks);
    setIsEditing(false);
  }

  return (
    <>
      {/* Parent task */}
      <>
        {isEditing ? (
          <CreateEditTaskForm handleUpdateTask={onUpdate} onClose={() => setIsEditing(false)} task={task} />
        ) : (
          <li className="group flex items-center p-2 rounded-lg bg-[var(--surface-elevated)] hover:shadow-sm">
            <label className="flex items-center gap-2 grow">
              <input
                id-={id}
                name={text}
                type="checkbox"
                checked={completed}
                onChange={() => handleToggleTask(id, parentId, completed)}
              />
              <span className={`text-lg te ${completed && "line-through text-[var(--color-text-muted)]"}`}>
                {text}
              </span>
            </label>
            <div className="flex items-center gap-2">
            {!parentId && (
              <Button
                ariaLabel="Add sub-task"
                hidden={true}
                icon={<SvgAdd />}
                onClick={() => setIsEditing(true)}
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
                onClick={() => handleDeleteTask(id, parentId)}
                size="xsmall"
                variant="ghost"
              />
            </div>
          </li>
        )}
      </>

      {/* Sub-tasks */}
      {(subtasks && subtasks.length > 0) && (
        <ul className="pl-[28px]">
          {subtasks.map((subtask) => (
            <Task
              key={subtask.id}
              handleUpdateTask={handleUpdateTask}
              handleToggleTask={handleToggleTask}
              handleDeleteTask={handleDeleteTask}
              task={subtask} />
          ))}
        </ul>
      )}
    </>
  );
}
