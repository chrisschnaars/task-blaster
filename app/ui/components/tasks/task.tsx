import { useState } from "react";

import { SvgEdit, SvgTrash } from "@/app/ui/components/icons";
import Button from "../shared/button";
import CreateEditTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import { Task as TaskTypes } from "@/types/global";

interface TaskProps {
  onDelete: () => void;
  onToggle: () => void;
  handleUpdateTask: (id: string, text:string, category:string) => void;
  task: TaskTypes;
}


export default function Task({ onToggle, onDelete, handleUpdateTask, task }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { id, text, completed } = task;

  const onUpdate = (id: string, text: string, category: string) => {
    handleUpdateTask(id, text, category);
    setIsEditing(false);
  }

  return (
    <>
      {isEditing ? (
        <CreateEditTaskForm handleUpdateTask={onUpdate} onClose={() => setIsEditing(false)} task={task} />
      ) : (
        <li className="group flex items-center p-2 rounded-lg hover:shadow-sm">
          <label className="flex items-center gap-2 grow">
            <input
              id-={id}
              name={text}
              type="checkbox"
              checked={completed}
              onChange={onToggle}
              className="w-5 h-5 accent-blue-500 cursor-pointer rounded-sm"
            />
            <span className={`text-lg te ${completed && "line-through text-[var(--color-ink-muted)]"}`}>
              {text}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <Button
              ariaLabel="Edit task"
              hidden={true}
              icon={<SvgEdit />} onClick={() => setIsEditing(true)}
              size="small"
              variant="ghost"
            />
            <Button
              ariaLabel="Edit task"
              hidden={true}
              icon={<SvgTrash />} onClick={onDelete}
              size="small"
              variant="ghost"
            />
          </div>
        </li>
      )}
    </>
  );
}
