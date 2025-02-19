import { useState } from "react";
import InlineTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import Button from "@/app/ui/components/shared/button";

interface ListHeaderProps {
  handleCreateTask: (text:string, category:string) => void;
  label: string;
}

export default function ListHeader({ label, handleCreateTask }: ListHeaderProps) {
  const [showTaskForm, setShowTaskForm ] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h1 className="heading-lg">{label}</h1>
        {!showTaskForm && (
          <Button onClick={() => setShowTaskForm(true)} >Add task</Button>
        )}
      </div>

      {showTaskForm && (
        <div className="my-4">
          <InlineTaskForm handleCreateTask={handleCreateTask} onClose={() => setShowTaskForm(false)} />
        </div>
      )}
    </>
  );
}
