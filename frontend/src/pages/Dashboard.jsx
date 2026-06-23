import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllTasks, updateTask, deleteTask } from "../services/api";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";

const FILTER_OPTIONS = ["All", "Pending", "In Progress", "Completed"];

/**
 * Dashboard page — displays all tasks with filtering, search, and stats.
 */
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Fetch all tasks on mount
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      showToast("Failed to fetch tasks. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle marking a task as completed
  const handleComplete = async (id) => {
    try {
      const updated = await updateTask(id, { status: "Completed" });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? updated : t))
      );
      showToast("Task marked as completed! ✓");
    } catch (error) {
      showToast("Failed to update task", "error");
    }
  };

  // Handle deleting a task (with confirmation)
  const handleDeleteClick = (id) => {
    setConfirmModal({
      id,
      title: "Delete Task",
      message: "Are you sure you want to delete this task? This action cannot be undone.",
    });
  };

  const confirmDelete = async () => {
    if (!confirmModal) return;
    try {
      await deleteTask(confirmModal.id);
      setTasks((prev) => prev.filter((t) => t._id !== confirmModal.id));
      showToast("Task deleted successfully");
    } catch (error) {
      showToast("Failed to delete task", "error");
    } finally {
      setConfirmModal(null);
    }
  };

  // Filter and search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      activeFilter === "All" || task.status === activeFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Count tasks by status
  const getCount = (status) => {
    if (status === "All") return tasks.length;
    return tasks.filter((t) => t.status === status).length;
  };

  return (
    <div className="main-content" id="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-header__title">Dashboard</h1>
        <p className="page-header__subtitle">
          Manage and track all your project tasks
        </p>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar" id="stats-bar">
        <div className="stat-card">
          <div className="stat-card__value">{tasks.length}</div>
          <div className="stat-card__label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{getCount("Pending")}</div>
          <div className="stat-card__label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{getCount("In Progress")}</div>
          <div className="stat-card__label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{getCount("Completed")}</div>
          <div className="stat-card__label">Completed</div>
        </div>
      </div>

      {/* Toolbar: Search + Add Button */}
      <div className="dashboard-toolbar">
        <div className="dashboard-toolbar__left">
          <div className="search-bar">
            <span className="search-bar__icon">🔍</span>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="search-input"
            />
          </div>
        </div>
        <Link to="/add-task" className="btn btn--primary btn--lg" id="add-task-btn">
          + New Task
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar" id="filter-bar">
        {FILTER_OPTIONS.map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${
              activeFilter === filter ? "filter-tab--active" : ""
            }`}
            onClick={() => setActiveFilter(filter)}
            id={`filter-${filter.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {filter}
            <span className="filter-tab__count">{getCount(filter)}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Fetching tasks..." />
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state" id="empty-state">
          <div className="empty-state__icon">
            {searchQuery ? "🔍" : "📝"}
          </div>
          <h3 className="empty-state__title">
            {searchQuery
              ? "No matching tasks"
              : activeFilter !== "All"
              ? `No ${activeFilter.toLowerCase()} tasks`
              : "No tasks yet"}
          </h3>
          <p className="empty-state__text">
            {searchQuery
              ? "Try a different search term"
              : "Create your first task to get started with project management!"}
          </p>
          {!searchQuery && (
            <Link to="/add-task" className="btn btn--primary btn--lg">
              + Create First Task
            </Link>
          )}
        </div>
      ) : (
        <div className="task-grid" id="task-grid">
          {filteredTasks.map((task, index) => (
            <div key={task._id} style={{ animationDelay: `${index * 0.05}s` }}>
              <TaskCard
                task={task}
                onComplete={handleComplete}
                onDelete={handleDeleteClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmModal && (
        <div
          className="modal-overlay"
          onClick={() => setConfirmModal(null)}
          id="confirm-modal"
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal__title">{confirmModal.title}</h3>
            <p className="modal__text">{confirmModal.message}</p>
            <div className="modal__actions">
              <button
                className="btn btn--ghost"
                onClick={() => setConfirmModal(null)}
                id="cancel-delete-btn"
              >
                Cancel
              </button>
              <button
                className="btn btn--danger"
                onClick={confirmDelete}
                id="confirm-delete-btn"
              >
                ✕ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`} id="toast-notification">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
