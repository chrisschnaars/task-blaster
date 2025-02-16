"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addTodo = async () => {
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: newTodo }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const addedTodo = await res.json();
      setTodos([...todos, addedTodo]);
      setNewTodo("");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold">Todo List</h1>

      <div className="mt-4">
        <input
          className="border p-2 rounded w-full"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo..."
        />
        <button onClick={addTodo} className="mt-2 bg-blue-500 text-white p-2 rounded w-full">
          Add Todo
        </button>
      </div>

      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo.id} className="p-2 border-b">
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
