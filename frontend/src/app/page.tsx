"use client";

import { useState, useEffect } from "react";
import { FileText, AlertTriangle } from "lucide-react";

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
  const [darkMode, setDarkMode] = useState(false);

  // Load and apply dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initial = saved ? saved === "true" : prefersDark;
    setDarkMode(initial);
    if (initial) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

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

  const toggleTodo = async (id: number) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      await fetch(`${API_BASE}/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
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
    <main className="min-h-screen bg-[#F2F0E4] dark:bg-[#000000] py-12 px-4 transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        {/* Header  */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F28705] via-[#F25C05] to-[#F24405] dark:from-[#F28705] dark:via-[#F25C05] dark:to-[#F24405] mb-4">
              My Todo List
            </h1>
            <p className="text-lg text-[#000000] dark:text-[#F2F0E4]">
              Stay organized and productive
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-8 p-5 bg-red-100/90 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl shadow-sm flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add new todo */}
        <div className="bg-[#F2F0E4]/90 dark:bg-[#000000]/90 rounded-2xl shadow-lg p-6 mb-10 border border-[#F24405]/20 backdrop-blur">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-6 py-5 text-[#000000] dark:text-[#F2F0E4] text-lg bg-white/80 dark:bg-[#000000]/80 border-2 border-[#F24405]/40 dark:border-[#F28705]/40 rounded-2xl focus:outline-none focus:border-[#F24405] focus:ring-4 focus:ring-[#F24405]/20 transition-all"
              disabled={loading}
            />
            <button
              onClick={addTodo}
              disabled={loading || !newTitle.trim()}
              className="px-10 py-5 bg-gradient-to-r from-[#F28705] via-[#F25C05] to-[#F24405] text-white font-bold text-lg rounded-2xl hover:from-[#F25C05] hover:via-[#F24405] hover:to-[#F28705] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Todo list */}
        <div className="space-y-4">
          {loading && todos.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#F24405] border-t-transparent"></div>
              <p className="mt-4 text-[#000000] dark:text-[#F2F0E4]">
                Loading your todos...
              </p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-20 bg-[#F2F0E4]/90 dark:bg-[#000000]/90 rounded-2xl shadow-lg border border-[#F24405]/20 backdrop-blur">
              <FileText
                className="w-24 h-24 mx-auto mb-6 text-[#F24405]"
                strokeWidth={1.5}
              />
              <p className="text-xl text-[#000000] dark:text-[#F2F0E4]">
                Your todo list is empty!
              </p>
              <p className="text-[#000000]/70 dark:text-[#F2F0E4]/70 mt-2">
                Add a task above to get started
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="group bg-[#F2F0E4]/90 dark:bg-[#000000]/90 rounded-2xl shadow-md hover:shadow-xl border border-[#F24405]/20 dark:border-[#F28705]/30 p-6 flex items-center gap-5 transition-all duration-300 backdrop-blur"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-7 w-7 text-[#F24405] rounded-lg focus:ring-[#F24405] focus:ring-2 cursor-pointer transition"
                />
                <span
                  className={`flex-1 text-xl font-medium transition-all ${
                    todo.completed
                      ? "line-through text-[#000000]/40 dark:text-[#F2F0E4]/40"
                      : "text-[#000000] dark:text-[#F2F0E4]"
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-60 group-hover:opacity-100 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold px-5 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer stats */}
        {todos.length > 0 && (
          <div className="mt-12 text-center text-[#000000]/80 dark:text-[#F2F0E4]/80">
            <p className="text-lg">
              {todos.filter((t) => !t.completed).length} active •{" "}
              {todos.filter((t) => t.completed).length} completed •{" "}
              {todos.length} total
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
