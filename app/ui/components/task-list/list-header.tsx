import { useState } from "react";
import CreateEditTaskForm from "@/app/ui/components/tasks/create-edit-task-form";
import { Button } from "@/app/ui/components/shared/button";

interface ListHeaderProps {
  label: string;
}

export default function ListHeader({ label }: ListHeaderProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h1 className="heading-lg">{label}</h1>
        {!showTaskForm && (
          <Button onClick={() => setShowTaskForm(true)}>Add task</Button>
        )}
      </div>

      {showTaskForm && (
        <CreateEditTaskForm onClose={() => setShowTaskForm(false)} />
      )}
    </>
  );
}
