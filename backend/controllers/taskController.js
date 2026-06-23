const Task = require("../models/Task");

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 */
const getAllTasks = async (req, res) => {
  try {
    // Sort by newest first
    const tasks = await Task.find().sort({ created_at: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (description.trim().length < 20) {
      return res.status(400).json({
        message: "Description must be at least 20 characters",
      });
    }

    // Validate status if provided
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending, In Progress, or Completed",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      status: status || "Pending",
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Update task status
 * @route   PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending, In Progress, or Completed",
      });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", id });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
