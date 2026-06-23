import axios from "axios";

/**
 * Axios instance configured to connect to the backend API.
 */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch all tasks from the server.
 * @returns {Promise<Array>} Array of task objects
 */
export const getAllTasks = async () => {
  const response = await API.get("/tasks");
  return response.data;
};

/**
 * Create a new task.
 * @param {Object} taskData - { title, description, status }
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

/**
 * Update a task's status.
 * @param {string} id - Task ID
 * @param {Object} updateData - { status }
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (id, updateData) => {
  const response = await API.put(`/tasks/${id}`, updateData);
  return response.data;
};

/**
 * Delete a task.
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteTask = async (id) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export default API;
