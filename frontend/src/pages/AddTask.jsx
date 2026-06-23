import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createTask } from "../services/api";

/**
 * AddTask page — form to create a new task with client-side validation.
 */
function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Client-side validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = `Description must be at least 20 characters (${formData.description.trim().length}/20)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      await createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
      });
      showToast("Task created successfully! 🎉");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create task. Please try again.";
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate description character count
  const descLength = formData.description.trim().length;

  return (
    <div className="main-content" id="add-task-page">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-header__title">Create New Task</h1>
        <p className="page-header__subtitle">
          Add a new task to your project board
        </p>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate id="add-task-form">
            {/* Title Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title">
                Task Title <span className="form-label__required">*</span>
              </label>
              <input
                type="text"
                id="task-title"
                name="title"
                className={`form-input ${errors.title ? "form-input--error" : ""}`}
                placeholder="e.g., Build Login Page"
                value={formData.title}
                onChange={handleChange}
                autoFocus
              />
              {errors.title && (
                <div className="form-error" id="title-error">
                  ⚠ {errors.title}
                </div>
              )}
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-description">
                Description <span className="form-label__required">*</span>
              </label>
              <textarea
                id="task-description"
                name="description"
                className={`form-textarea ${
                  errors.description ? "form-textarea--error" : ""
                }`}
                placeholder="Describe the task in detail (minimum 20 characters)..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
              />
              <div className="form-hint">
                {descLength}/20 characters minimum
                {descLength >= 20 && " ✓"}
              </div>
              {errors.description && (
                <div className="form-error" id="description-error">
                  ⚠ {errors.description}
                </div>
              )}
            </div>

            {/* Status Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={submitting}
                id="submit-task-btn"
              >
                {submitting ? "Creating..." : "✓ Create Task"}
              </button>
              <Link
                to="/"
                className="btn btn--ghost btn--lg"
                id="cancel-btn"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`} id="toast-notification">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default AddTask;
