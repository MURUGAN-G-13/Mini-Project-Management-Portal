const mongoose = require("mongoose");

/**
 * Task Schema
 * 
 * Fields:
 *   - title:       String, required
 *   - description: String, required, minimum 20 characters
 *   - status:      String, enum (Pending, In Progress, Completed), defaults to "Pending"
 *   - created_at:  Date, auto-set to current timestamp
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "Status must be Pending, In Progress, or Completed",
      },
      default: "Pending",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Include virtual id field and remove __v from JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Task", taskSchema);
