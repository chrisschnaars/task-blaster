"use client";

import { useQuery } from "@tanstack/react-query";

import Header from "@/app/ui/components/shared/header";
import ListHeader from "../ui/components/task-list/list-header";
import TasksSection from "@/app/ui/components/task-list/tasks-section";
import { Task as TaskTypes } from "@/types/global";

const fetchTasks = async () => {
  const response = await fetch("/api/tasks"); // Adjust this to your actual API route
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

// Helper function to group tasks by category
const groupTasksByCategory = (tasks: TaskTypes[]) => {
  return {
    now: tasks.filter((task) => task.category === "now"),
    soon: tasks.filter((task) => task.category === "soon"),
    later: tasks.filter((task) => task.category === "later"),
  };
};

export default function Tasks() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // TODO: fix these states up...
  if (isLoading) return <p>Loading tasks...</p>;
  if (error) return <p>Error loading tasks: {error.message}</p>;

  const groupedTasks = groupTasksByCategory(tasks);

  const handleUpdateTask = async (
    id: string,
    text: string,
    category: string,
    subtasks: string[]
  ) => {
    try {
      const response = await fetch("/api/tasks/updateTask", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          text: text,
          category: category,
          subtasks: subtasks,
        }),
      });

      if (!response.ok) throw new Error(`Failed to update task`);

      const updatedTask = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />

      <div className="task-list">
        <ListHeader label="Doing" />

        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([category, tasks]) => (
            <TasksSection
              key={category}
              category={category}
              handleUpdateTask={handleUpdateTask}
              tasks={tasks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
