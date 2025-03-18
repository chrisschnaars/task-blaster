import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateSubtaskInput = {
  parentId: string;
  category: string;
  text: string;
};

export const useCreateSubtask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parentId, category, text }: CreateSubtaskInput) => {
      const response = await fetch("/api/tasks/createSubtask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, category, parentId }), // Assign a default category
      });

      if (!response.ok) {
        throw new Error("Failed to create subtask");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh tasks list
    },
  });
};
