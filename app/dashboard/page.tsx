"use client";

import { useEffect, useState } from "react";

import { Add } from '@/app/ui/components/icons';
import Header from "@/app/ui/components/shared/header"
import InlineTaskForm from "@/app/ui/components/tasks/inline-task-form";
import ListHeader from "@/app/ui/components/task-list/header";
import Task from "@/app/ui/components/tasks/task"
import { Task as TaskTypes } from "@/types/global";

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskTypes[]>([]);
  const [showInlineForm, setShowInlineForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        setTasks(await response.json());
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (text: string) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });

    if (response.ok) {
      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
    }
  };

  const handleUpdateTask = async (id: string, text: string) => {
    try {
      const response = await fetch("/api/tasks/updateTask", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, text: text}),
      });

      if (!response.ok) throw new Error(`Failed to update task`);

      const updatedTask = await response.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      // Optimistically update UI
      setTasks(tasks.filter(task => task.id !== id));

      // Send DELETE request to the API
      const response = await fetch("/api/tasks/deleteTask", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });


      if (!response.ok) {
        console.log(response)
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Rollback UI change if API fails
      setTasks(prev => [...prev, tasks.find(task => task.id === id)!]);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      // Optimistically update UI
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: !completed } : task
      ));

      // Send API request to update in database
      const response = await fetch("/api/tasks/toggleTask", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error toggling task:", error);
      // Rollback UI change if API fails
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed } : task
      ));
    }
  };

  return (
    <div>
      <Header />
      <div className="wrapper">

        <ListHeader label="Doing" handleCreateTask={handleCreateTask} />

        <div className="mt-8">
          <h2 className="heading-md">Now</h2>
          <ul className="mt-2">
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onDelete={() => handleDeleteTask(task.id)}
                onToggle={() => handleToggleTask(task.id, task.completed)}
                handleUpdateTask={handleUpdateTask}
              />
            ))}
          </ul>
          {showInlineForm ? (
            <InlineTaskForm handleCreateTask={handleCreateTask} onClose={() => setShowInlineForm(false)} />
          ) : (
            <button onClick={() => setShowInlineForm(true)} className="flex items-center gap-2 p-2 w-full opacity-50 hover:opacity-100">
              <div className="p-[2px]">
                <Add className="text-black size-4" />
              </div>
              Add task
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
