import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium, or high',
      },
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false,
  }
);

// Index for efficient filtering and searching
todoSchema.index({ completed: 1 });
todoSchema.index({ createdAt: -1 });
todoSchema.index({ title: 'text', description: 'text' });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
