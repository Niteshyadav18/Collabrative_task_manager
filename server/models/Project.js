import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    minlength: [2, 'Project name must be at least 2 characters long'],
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
      message: 'Status must be one of: planning, active, on_hold, completed, cancelled'
    },
    default: 'planning'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Priority must be one of: low, medium, high, critical'
    },
    default: 'medium'
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || !this.start_date || value > this.start_date;
      },
      message: 'End date must be after start date'
    }
  },
  team_members: [{
    user: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['lead', 'developer', 'designer', 'tester', 'analyst'],
      default: 'developer'
    },
    joined_at: {
      type: Date,
      default: Date.now
    }
  }],
  budget: {
    allocated: {
      type: Number,
      min: [0, 'Budget cannot be negative']
    },
    spent: {
      type: Number,
      min: [0, 'Spent amount cannot be negative'],
      default: 0
    }
  },
  progress: {
    type: Number,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be more than 100'],
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  created_by: {
    type: String,
    required: [true, 'Creator is required'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for project duration in days
projectSchema.virtual('durationInDays').get(function() {
  if (!this.end_date) return null;
  return Math.ceil((this.end_date - this.start_date) / (1000 * 60 * 60 * 24));
});

// Virtual for remaining budget
projectSchema.virtual('remainingBudget').get(function() {
  if (!this.budget.allocated) return null;
  return this.budget.allocated - this.budget.spent;
});

// Virtual for task count
projectSchema.virtual('taskCount', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project_id',
  count: true
});

// Indexes
projectSchema.index({ status: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ created_by: 1 });
projectSchema.index({ 'team_members.user': 1 });
projectSchema.index({ start_date: 1 });
projectSchema.index({ end_date: 1 });

// Static method to get active projects
projectSchema.statics.getActiveProjects = function() {
  return this.find({ status: 'active' }).sort({ priority: -1, start_date: -1 });
};

// Static method to get projects by team member
projectSchema.statics.getProjectsByMember = function(memberName) {
  return this.find({ 'team_members.user': memberName }).sort({ start_date: -1 });
};

// Instance method to add team member
projectSchema.methods.addTeamMember = function(user, role = 'developer') {
  const existingMember = this.team_members.find(member => member.user === user);
  if (!existingMember) {
    this.team_members.push({ user, role });
    return this.save();
  }
  return this;
};

// Instance method to remove team member
projectSchema.methods.removeTeamMember = function(user) {
  this.team_members = this.team_members.filter(member => member.user !== user);
  return this.save();
};

export default mongoose.model('Project', projectSchema);