import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'manager', 'developer', 'designer', 'tester'],
      message: 'Role must be one of: admin, manager, developer, designer, tester'
    },
    default: 'developer'
  },
  department: {
    type: String,
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  avatar: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      task_assigned: { type: Boolean, default: true },
      task_completed: { type: Boolean, default: true },
      due_date_reminder: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name (if we had first/last name fields)
userSchema.virtual('displayName').get(function() {
  return this.name;
});

// Virtual for task count
userSchema.virtual('taskCount', {
  ref: 'Task',
  localField: 'name',
  foreignField: 'assigned_to',
  count: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ name: 1 });
userSchema.index({ role: 1 });
userSchema.index({ is_active: 1 });

// Static method to get active users
userSchema.statics.getActiveUsers = function() {
  return this.find({ is_active: true }).sort({ name: 1 });
};

// Static method to get users by role
userSchema.statics.getUsersByRole = function(role) {
  return this.find({ role, is_active: true }).sort({ name: 1 });
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.last_login = new Date();
  return this.save();
};

export default mongoose.model('User', userSchema);