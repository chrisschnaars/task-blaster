import { useState } from "react";
import Button from "@/app/ui/components/shared/button";
import { Task } from "@/types/global";

interface InlineTaskFormProps {
  handleCreateTask?: (text: string) => void;
  handleUpdateTask?: (id: string, text: string) => void;
  onClose?: () => void;
  task?: Task;
}

export default function InlineTaskForm({ handleCreateTask, handleUpdateTask, onClose, task }: InlineTaskFormProps) {
  const [content, setContent] = useState(task ? task.text : "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(content)
    if (!content.trim()) return;

    if (task) {
      console.log("upate")
      handleUpdateTask(task.id, content);
    } else {
      console.log("create")
      handleCreateTask(content);
    }

    setContent('');
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg overflow-hidden">
      <input
        autoFocus
        className="p-2 w-full focus-visible:!outline-none"
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add task..."
        type="text"
        value={content}
      />
      <div className="flex gap-2 items-center justify-end p-2 border-t border-gray-200">
        <Button onClick={onClose} type="button" variant="secondary" >Cancel</Button>
        <Button type="submit" variant="primary">{`${task ? "Update" : "Add"} task`}</Button>
      </div>
    </form>
  );
}
