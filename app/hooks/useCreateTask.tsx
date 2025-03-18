import { useMutation, useQueryClient } from "@tanstack/react-query";

type TaskInput = {
  text: string;
  category: string;
  subtasks: string[];
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTask: TaskInput) => {
      const response = await fetch("/api/tasks/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
