import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateTaskInput = {
  id: string;
  text: string;
  category: string;
  subtasks: {
    text: string;
    category: string;
    completed: boolean;
    parentId: string;
  }[];
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, text, category, subtasks }: UpdateTaskInput) => {
      const response = await fetch("/api/tasks/updateTask", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text, category, subtasks }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh task list
    },
  });
};
