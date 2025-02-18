import { useState } from "react";
import Button from "@/app/ui/components/shared/button";

interface CreateEditTaskformProps {
  onAdd: (text: string) => void;
}

export default function CreateEditTaskForm({ onAdd}: CreateEditTaskformProps) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd(newTask);
    setNewTask('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        className="border p-2 rounded-lg w-full"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add task..."
        autoFocus
      />
      <Button type="submit">
        Add
      </Button>
    </form>
  );
}
