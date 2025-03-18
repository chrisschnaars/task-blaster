import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteTaskInput = {
  id: string;
  parentId?: string | null; // Parent ID is optional
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, parentId }: DeleteTaskInput) => {
      const response = await fetch(`/api/tasks/deleteTask`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, parentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh tasks list
    },
  });
};
