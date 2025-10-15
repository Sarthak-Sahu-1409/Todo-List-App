const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todo_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ CREATE
app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.create({ text: req.body.text });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// ✅ UPDATE
app.put("/todos/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
