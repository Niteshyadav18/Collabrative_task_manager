export const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed'
};

export const statusConfig = {
  [TaskStatus.TODO]: { 
    label: 'To Do', 
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  [TaskStatus.IN_PROGRESS]: { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  [TaskStatus.REVIEW]: { 
    label: 'Review', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  [TaskStatus.COMPLETED]: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800 border-green-200'
  }
};