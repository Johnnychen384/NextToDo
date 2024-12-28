import React, { useState, useEffect } from 'react';
import { Auth, API } from 'aws-amplify';
import './Todo.css';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [user, setUser] = useState(null);

  // Fetch current user and todos on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);

        const response = await API.get('TodoAPI', '/todos');
        setTodos(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Add a new task
  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      const newTask = { id: Date.now(), task: newTodo };

      try {
        await API.post('TodoAPI', '/todos', { body: newTask });
        setTodos((prevTodos) => [...prevTodos, newTask]);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  // Delete a task
  const handleDeleteTodo = async (id) => {
    try {
      await API.del('TodoAPI', `/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Enable edit mode
  const handleEditTodo = (id, currentTask) => {
    setEditingId(id);
    setEditText(currentTask);
  };

  // Save the edited task
  const handleSaveEdit = async () => {
    const updatedTask = { id: editingId, task: editText };

    try {
      await API.put('TodoAPI', `/todos/${editingId}`, { body: updatedTask });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === editingId ? updatedTask : todo))
      );
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  return (
    <div className="todo-container">
      <h2>Welcome, {user?.username || 'User'}!</h2>

      {/* Input for new tasks */}
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* List of tasks */}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              // Edit Mode
              <div className="edit-mode">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={handleSaveEdit}>Save</button>
                <button
                  className="cancel-button"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              // View Mode
              <>
                {todo.task}
                <button onClick={() => handleEditTodo(todo.id, todo.task)}>Edit</button>
                <button className="cancel-button" onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;
