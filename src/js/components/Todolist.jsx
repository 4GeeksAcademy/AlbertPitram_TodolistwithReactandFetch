


 import React, { useEffect, useState } from 'react';
import './Todolist.css';

const USERNAME = 'Pitramgod';
const API_URL = `https://playground.4geeks.com/apis/fake/todos/user/${USERNAME}`;

function Todolist() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);

  
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else if (res.status === 404) {
        console.warn('Usser not found creating one');
        await createUser();
      } else {
        console.error('Error loading tasks:', res.status);
        setError('Error loading tasks');
      }
    } catch (err) {
      console.error('Network error loading:', err);
      setError('Network error loading');
    }
  };

  const createUser = async () => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          { label: 'Study React', done: false },
          { label: 'Learn Python', done: false },
          { label: 'Comprend C#', done: false }
        ]),
      });

      if (res.ok) {
        console.log('User created with initial tasks');
        fetchTasks();
      } else {
        const err = await res.json();
        console.error('Error creating user:', err);
        setError('Error creating user');
      }
    } catch (err) {
      console.error('Network error creating user:', err);
      setError('Network error creating user');
    }
  };

  const updateTasks = async (newTasks) => {
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTasks),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const err = await res.json();
        console.error('Error updating tasks:', err);
        setError('Error updating tasks');
      }
    } catch (err) {
      console.error('Network error creating user:', err);
      setError('Network error creating user:');
    }
  };

  const addTask = () => {
    const label = inputValue.trim();
    if (label === '') return;

    const newTasks = [...tasks, { label, done: false }];
    updateTasks(newTasks);
    setInputValue('');
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    updateTasks(newTasks);
  };

  const clearAllTasks = () => {
    updateTasks([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
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
      />

      <ul className="list-group">
        {tasks.length === 0 ? (
          <li className="list-group-item text-muted">No tasks, add one!</li>
        ) : (
          tasks.map((task, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{task.label}</span>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteTask(index)}
              >
                ✖
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="mt-3 text-center">
        <small className="text-muted">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </small>
      </div>

      {tasks.length > 0 && (
        <div className="text-center mt-3">
          <button className="btn btn-warning" onClick={clearAllTasks}>
            Clear all
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}

export default Todolist;
