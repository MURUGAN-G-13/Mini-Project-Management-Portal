/**
 * TaskCard component displays a single task with status badge and action buttons.
 *
 * Props:
 *   - task: { _id, title, description, status, created_at }
 *   - onComplete: (id) => void
 *   - onDelete: (id) => void
 */
function TaskCard({ task, onComplete, onDelete }) {
  const statusClass = task.status
    .toLowerCase()
    .replace(/\s+/g, "-");

  const isCompleted = task.status === "Completed";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`task-card ${isCompleted ? "task-card--completed" : ""}`}
      id={`task-card-${task._id}`}
    >
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span className={`status-badge status-badge--${statusClass}`}>
          <span className="status-badge__dot"></span>
          {task.status}
        </span>
      </div>

      <p className="task-card__description">{task.description}</p>

      <div className="task-card__footer">
        <span className="task-card__date">
          📅 {formatDate(task.created_at)} • {formatTime(task.created_at)}
        </span>

        <div className="task-card__actions">
          {!isCompleted && (
            <button
              className="btn btn--success"
              onClick={() => onComplete(task._id)}
              title="Mark as Completed"
              id={`complete-btn-${task._id}`}
            >
              ✓ Complete
            </button>
          )}
          <button
            className="btn btn--danger"
            onClick={() => onDelete(task._id)}
            title="Delete Task"
            id={`delete-btn-${task._id}`}
          >
            ✕ Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
