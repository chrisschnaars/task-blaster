import { useState } from "react";

import { SvgAdd } from '@/app/ui/components/icons';
import CreateEditTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import Task from "@/app/ui/components/tasks/task";
import { Task as TaskTypes } from "@/types/global";

interface TasksSectionProps {
  category: string;
  handleCreateTask: (text: string, category: string, subtasks: string[]) => void;
  handleDeleteTask: (taskId: string, parentId: string | null) => void;
  handleToggleTask: (id: string, parentId: string | null, completed: boolean) => void;
  handleUpdateTask: (id: string, text: string, category: string, subtasks: string[]) => void;
  tasks: Array<TaskTypes>;
}

export default function TasksSection({ category, handleCreateTask, handleDeleteTask, handleToggleTask, handleUpdateTask, tasks }: TasksSectionProps) {
  const [showInlineForm, setShowInlineForm] = useState(false);

  return (
    <div key={category} className="mt-8">
      <h2 className="heading-md capitalize">{category}</h2>
      {tasks.length > 0 && (
        <ul className="mt-2">
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              handleDeleteTask={handleDeleteTask}
              handleToggleTask={handleToggleTask}
              handleUpdateTask={handleUpdateTask}
            />
          ))}
        </ul>
      )}

      {showInlineForm ? (
        <CreateEditTaskForm defaultCategory={category} handleCreateTask={handleCreateTask} onClose={() => setShowInlineForm(false)} />
      ) : (
        <button onClick={() => setShowInlineForm(true)} className="group flex items-center gap-2 p-2 w-full rounded-lg bg-transparent hover:bg-[var(--color-button-bg-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
          <div className="p-[2px]">
            <SvgAdd className="size-4" />
          </div>
          Add task
        </button>
      )}
    </div>
  );
}
