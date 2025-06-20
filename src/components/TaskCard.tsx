import React, { useState } from 'react';
import { Task, TaskStatus, UpdateTaskData } from '../types/Task';
import { 
  Clock, 
  User, 
  Calendar, 
  MoreVertical, 
  Edit2, 
  Trash2,
  CheckCircle2,
  Circle,
  PlayCircle,
  EyeIcon
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: UpdateTaskData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const statusConfig = {
  [TaskStatus.TODO]: { 
    label: 'To Do', 
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Circle
  },
  [TaskStatus.IN_PROGRESS]: { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: PlayCircle
  },
  [TaskStatus.REVIEW]: { 
    label: 'Review', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: EyeIcon
  },
  [TaskStatus.COMPLETED]: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    assigned_to: task.assigned_to,
    status: task.status
  });

  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus });
  };

  const handleEdit = async () => {
    await onUpdate(task.id, editData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDelete(task.id);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full text-lg font-semibold border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
          placeholder="Task title"
        />
        
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full text-gray-600 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          placeholder="Task description"
        />

        <div className="flex gap-3">
          <input
            type="text"
            value={editData.assigned_to}
            onChange={(e) => setEditData({ ...editData, assigned_to: e.target.value })}
            className="flex-1 border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Assigned to"
          />
          
          <select
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
            className="border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {task.description}
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          
          {showActions && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowActions(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={16} />
                Edit Task
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{task.assigned_to}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{new Date(task.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${statusInfo.color}`}
          >
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};