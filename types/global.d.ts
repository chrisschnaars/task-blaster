export type Task = {
  id: string;
  parentId: string;
  text: string;
  category: string;
  subtasks: Array<Task>;
  completed: boolean;
};
