"use client";

import { useEffect, useState } from "react";


import Header from "@/app/ui/components/shared/header"

import ListHeader from "../ui/components/task-list/list-header";
import TasksSection from "@/app/ui/components/task-list/tasks-section";
import { Task as TaskTypes } from "@/types/global";

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskTypes[]>([]);

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

  // Group tasks by category
  const groupedTasks = {
    now: tasks.filter((task) => task.category === "now"),
    soon: tasks.filter((task) => task.category === "soon"),
    later: tasks.filter((task) => task.category === "later"),
  };

  const handleCreateTask = async (text: string, category: string, subtasks: string[]) => {
    try {
      const response = await fetch("/api/tasks/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text, category: category, subtasks: subtasks }),
      });

      if (!response.ok) throw new Error(`Failed to create task`);

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
    } catch(error) {
      console.error("Error:", error);
    }
  };

  const handleUpdateTask = async (id: string, text: string, category: string, subtasks: string[]) => {
    try {
      const response = await fetch("/api/tasks/updateTask", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, text: text, category: category, subtasks: subtasks}),
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

  const handleDeleteTask = async (taskId: string, parentId: string | null) => {
    try {
      // Check if deleting a subtask
      if (parentId !== null) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === parentId
              ? { ...task, subtasks: task.subtasks.filter((sub) => sub.id !== taskId) }
              : task
          )
        );
      } else {
        // If a parent task is being deleted
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }

      // Send DELETE request to the API
      const response = await fetch("/api/tasks/deleteTask", {
        method: "DELETE",
        body: JSON.stringify({ taskId, parentId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      // Rollback UI change if API fails
      setTasks(prev => [...prev, tasks.find(task => task.id === taskId)!]);
    }
  };

  const handleToggleTask = async (id: string, parentId: string | null, completed: boolean) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          // Handling parent task
          if (task.id === id && !parentId) {
            return {...task, completed: !completed}
          }

          // Handle subtask
          if (task.id === parentId) {
            const updatedSubtasks = task.subtasks.map((sub) =>
              sub.id === id ? { ...sub, completed: !completed } : sub
            );

            console.log(updatedSubtasks)

            return {
              ...task,
              subtasks: updatedSubtasks,
            };
          }

          return task;
        })
      );

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
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          // Handling parent task
          if (task.id === id && !parentId) {
            return {...task, completed: completed}
          }

          // Handle subtask
          if (task.id === parentId) {
            const updatedSubtasks = task.subtasks.map((sub) =>
              sub.id === id ? { ...sub, completed: completed } : sub
            );

            console.log(updatedSubtasks)

            return {
              ...task,
              subtasks: updatedSubtasks,
            };
          }

          return task;
        })
      );
    }
  };

  return (
    <div>
      <Header />

      <div className="task-list">

        <ListHeader label="Doing" handleCreateTask={handleCreateTask} />

        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([category, tasks]) => (
            <TasksSection
              key={category}
              category={category}
              handleCreateTask={handleCreateTask}
              handleDeleteTask={handleDeleteTask}
              handleToggleTask={handleToggleTask}
              handleUpdateTask={handleUpdateTask}
              tasks={tasks} />
          ))}
        </div>
      </div>
    </div>
  );
}
