import { useMutation, useQueryClient } from "@tanstack/react-query";

type ToggleTaskInput = {
  id: string;
  completed: boolean;
};

export const useToggleTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, completed }: ToggleTaskInput) => {
      const response = await fetch(`/api/tasks/toggleTask`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh tasks list
    },
  });
};
