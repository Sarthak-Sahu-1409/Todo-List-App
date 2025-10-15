import React, { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  // State to track which todo is being edited
  const [editingId, setEditingId] = useState(null);
  const API = "http://localhost:5000/todos";

  // ✅ READ: Load all todos
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  // ✅ CREATE: Add new todo
  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText("");
  };

  // ✅ UPDATE: Update todo text
  const updateTodoText = async (id, newText) => {
    // If the new text is empty, delete the todo instead.
    if (!newText.trim()) {
      deleteTodo(id);
      return;
    }
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText }),
    });
    // Update the local state to reflect the change
    setTodos(todos.map((t) => (t._id === id ? { ...t, text: newText } : t)));
    setEditingId(null); // Exit editing mode
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingId(todo._id);
  };

  // ✅ DELETE: Delete todo
  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t._id !== id));
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>📝 Todo App</h2>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task..."
      />
      <button onClick={addTodo}>Add</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((t) => (
          <li key={t._id} style={{ marginBottom: "10px" }}>
            {editingId === t._id ? (
              <input
                type="text"
                defaultValue={t.text}
                onBlur={(e) => updateTodoText(t._id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodoText(t._id, e.target.value);
                  }
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={() => startEditing(t)}
                style={{ cursor: "pointer", marginRight: "10px" }}
              >
                {t.text}
              </span>
            )}
            <button
              onClick={() => deleteTodo(t._id)}
              style={{ marginLeft: 10 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
