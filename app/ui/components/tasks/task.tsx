import { useState } from "react";

import { Edit, Trash } from "@/app/ui/components/icons";
import IconButton from "@/app/ui/components/shared/icon-button";
import InlineTaskForm from "@/app/ui/components/tasks/inline-task-form";
import { Task as TaskTypes } from "@/types/global";

interface TaskProps {
  onDelete: () => void;
  onToggle: () => void;
  handleUpdateTask: (id: string, text:string) => void;
  task: TaskTypes;
}


export default function Task({ onToggle, onDelete, handleUpdateTask, task }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { id, text, completed } = task;

  const onUpdate = (id: string, text: string) => {
    handleUpdateTask(id, text);
    setIsEditing(false);
  }

  return (
    <>
      {isEditing ? (
        <InlineTaskForm handleUpdateTask={onUpdate} onClose={() => setIsEditing(false)} task={task} />
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
            <span className={`text-lg ${completed && "line-through text-gray-500"}`}>
              {text}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <IconButton extraClasses="opacity-0 group-hover:opacity-100 hover-focus:opacity-100" size="small" icon={<Edit />} onClick={() => setIsEditing(true)} variant="ghost" />
            <IconButton extraClasses="opacity-0 group-hover:opacity-100 hover-focus:opacity-100" size="small" icon={<Trash />} onClick={onDelete} variant="ghost" />
          </div>
        </li>
      )}
    </>
  );
}
