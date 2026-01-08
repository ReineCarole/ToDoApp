"use client";

import { useState, useEffect } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTitle.trim()) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, completed: false }),
      });

      if (!res.ok) throw new Error("Failed to add todo");
      setNewTitle("");
      await fetchTodos();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      await fetch(`${API_BASE}/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !completed }),
      });
      await fetchTodos();
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/todos/${id}`, { method: "DELETE" });
      await fetchTodos();
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Todo App
        </h1>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Add new todo - Updated to match your screenshot */}
        <div className="flex items-center gap-4 mb-12 max-w-2xl mx-auto">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 px-6 py-5 text-black text-lg bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm transition"
            disabled={loading}
          />
          <button
            onClick={addTodo}
            disabled={loading || !newTitle.trim()}
            className="px-10 py-5 bg-blue-600 text-white font-semibold text-lg rounded-2xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md transition"
          >
            Add
          </button>
        </div>

        {/* Todo list */}
        {loading && todos.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No todos yet. Add one above!
          </div>
        ) : (
          <ul className="space-y-4 max-w-2xl mx-auto">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                  className="h-6 w-6 text-blue-600 rounded focus:ring-blue-500"
                />
                <span
                  className={`flex-1 text-xl ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
