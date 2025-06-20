import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  assigned_to: {
    type: String,
    required: [true, 'Task must be assigned to someone'],
    trim: true,
    minlength: [1, 'Assignee name must be at least 1 character long'],
    maxlength: [100, 'Assignee name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['todo', 'in_progress', 'review', 'completed'],
      message: 'Status must be one of: todo, in_progress, review, completed'
    },
    default: 'todo'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be one of: low, medium, high, urgent'
    },
    default: 'medium'
  },
  due_date: {
    type: Date,
    validate: {
      validator: function(value) {
        // Due date should be in the future if provided
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  estimated_hours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    max: [1000, 'Estimated hours cannot exceed 1000']
  },
  actual_hours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    max: [1000, 'Actual hours cannot exceed 1000']
  },
  completed_at: {
    type: Date
  },
  created_by: {
    type: String,
    trim: true,
    maxlength: [100, 'Creator name cannot exceed 100 characters']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for task age in days
taskSchema.virtual('ageInDays').get(function() {
  return Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.due_date && this.due_date < new Date() && this.status !== 'completed';
});

// Virtual for completion status
taskSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Indexes for better query performance
taskSchema.index({ status: 1 });
taskSchema.index({ assigned_to: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ due_date: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ status: 1, assigned_to: 1 });
taskSchema.index({ title: 'text', description: 'text' }); // Text search index

// Pre-save middleware to set completed_at when status changes to completed
taskSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completed_at) {
      this.completed_at = new Date();
    } else if (this.status !== 'completed') {
      this.completed_at = undefined;
    }
  }
  next();
});

// Pre-save middleware to validate due_date
taskSchema.pre('save', function(next) {
  if (this.due_date && this.due_date <= new Date()) {
    const error = new Error('Due date must be in the future');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

// Static method to get tasks by status
taskSchema.statics.getTasksByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get overdue tasks
taskSchema.statics.getOverdueTasks = function() {
  return this.find({
    due_date: { $lt: new Date() },
    status: { $ne: 'completed' }
  }).sort({ due_date: 1 });
};

// Static method to get tasks by assignee
taskSchema.statics.getTasksByAssignee = function(assignee) {
  return this.find({ assigned_to: assignee }).sort({ createdAt: -1 });
};

// Instance method to mark as completed
taskSchema.methods.markCompleted = function() {
  this.status = 'completed';
  this.completed_at = new Date();
  return this.save();
};

// Instance method to update status
taskSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'completed') {
    this.completed_at = new Date();
  } else {
    this.completed_at = undefined;
  }
  return this.save();
};

export default mongoose.model('Task', taskSchema);