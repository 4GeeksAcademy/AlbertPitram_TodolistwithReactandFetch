import React, { useEffect, useState } from "react";

const USERNAME = "AlbertTroll";
const API_BASE = "https://playground.4geeks.com/todo";

function Todolist() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/${USERNAME}`);
      if (res.ok) {
        const data = await res.json();
        const todos = data.todos || [];
        const formatted = todos.map((t) => ({
          id: t.id,
          label: t.label,
          done: t.is_done,
        }));
        setTasks(formatted);
      } else if (res.status === 404) {
        await createUser();
      } else {
        setError("Error loading tasks");
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
    setLoading(false);
  };

  const createUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchTasks();
      } else {
        setError("Error creating user");
      }
    } catch (err) {
      setError("Network error creating user");
      console.error(err);
    }
    setLoading(false);
  };

  const addTask = async () => {
    const label = inputValue.trim();
    if (!label) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${USERNAME}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, is_done: false }),
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, { id: newTask.id, label: newTask.label, done: newTask.is_done }]);
        setInputValue("");
      } else {
        setError("Error adding task");
      }
    } catch (err) {
      setError("Network error adding task");
      console.error(err);
    }
    setLoading(false);
  };

  const deleteTask = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      } else {
        setError("Error deleting task");
      }
    } catch (err) {
      setError("Network error deleting task");
      console.error(err);
    }
  };

  const clearAllTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all(
        tasks.map(async (t) => {
          const res = await fetch(`${API_BASE}/todos/${t.id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Error deleting task");
        })
      );
      setTasks([]);
    } catch (err) {
      setError("Error deleting all tasks");
      console.error(err);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="Todolist container mt-4">
      <h2 className="text-center mb-4">To-Do List</h2>

      <input
        className="form-control mb-3"
        type="text"
        placeholder="Add a Task"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />

      <ul className="list-group">
        {tasks.length === 0 ? (
          <li className="list-group-item text-muted">No tasks, add one!</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span style={{ textDecoration: task.done ? "line-through" : "none" }}>
                {task.label}
              </span>
              <div>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => deleteTask(task.id)}
                  disabled={loading}
                >
                  ✖
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="mt-3 text-center">
        <small className="text-muted">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </small>
      </div>

      {tasks.length > 0 && (
        <div className="text-center mt-3">
          <button className="btn btn-warning" onClick={clearAllTasks} disabled={loading}>
            Clear all
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default Todolist;
