const express = require("express");
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// GET    /api/tasks      — Retrieve all tasks
router.get("/", getAllTasks);

// POST   /api/tasks      — Create a new task
router.post("/", createTask);

// PUT    /api/tasks/:id  — Update task status
router.put("/:id", updateTask);

// DELETE /api/tasks/:id  — Delete a task
router.delete("/:id", deleteTask);

module.exports = router;
