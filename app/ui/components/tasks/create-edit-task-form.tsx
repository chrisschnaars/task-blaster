import { useState } from "react";
import Button from "@/app/ui/components/shared/button";
import Select from "@/app/ui/components/shared/select";
import { Task } from "@/types/global";

interface CreateEditTaskForm {
  handleCreateTask?: (text: string, category: string) => void;
  handleUpdateTask?: (id: string, text: string, category: string) => void;
  onClose?: () => void;
  task?: Task;
}

export default function CreateEditTaskForm({ handleCreateTask, handleUpdateTask, onClose, task }: CreateEditTaskForm) {
  const [text, setText] = useState(task ? task.text : "");
  const [category, setCategory] = useState(task ? task.category : "now");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;

    if (task) {
      console.log("upate")
      handleUpdateTask(task.id, text, category);
    } else {
      console.log("create")
      handleCreateTask(text, category);
    }

    setText('');
    setCategory('');
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg overflow-hidden">
      <input
        autoFocus
        className="p-2 w-full focus-visible:!outline-none"
        onChange={(e) => setText(e.target.value)}
        placeholder="Add task..."
        type="text"
        value={text}
      />
      <div className="flex items-center gap-4 justify-between p-2 border-t border-gray-200">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="h-8 bg-gray-100 border px-2 rounded-md">
          <option value="now">Now</option>
          <option value="soon">Soon</option>
          <option value="later">Later</option>
        </Select>
        <div className="flex gap-2 items-center justify-end ">
          <Button onClick={onClose} type="button" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">{`${task ? "Update" : "Add"} task`}</Button>
        </div>
      </div>
    </form>
  );
}
