import React from 'react';
import { TaskStatus } from '../constants/taskStatus.js';
import { CheckCircle2, Clock, PlayCircle, EyeIcon } from 'lucide-react';

export const TaskStats = ({ tasks }) => {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      status: TaskStatus.TODO,
      label: 'To Do',
      count: statusCounts[TaskStatus.TODO] || 0,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: Clock
    },
    {
      status: TaskStatus.IN_PROGRESS,
      label: 'In Progress',
      count: statusCounts[TaskStatus.IN_PROGRESS] || 0,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: PlayCircle
    },
    {
      status: TaskStatus.REVIEW,
      label: 'Review',
      count: statusCounts[TaskStatus.REVIEW] || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: EyeIcon
    },
    {
      status: TaskStatus.COMPLETED,
      label: 'Completed',
      count: statusCounts[TaskStatus.COMPLETED] || 0,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle2
    }
  ];

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round(((statusCounts[TaskStatus.COMPLETED] || 0) / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Task Overview</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Completion Rate:</div>
          <div className="text-sm font-semibold text-green-600">{completionRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.status} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-3`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.count}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {totalTasks > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{statusCounts[TaskStatus.COMPLETED] || 0} of {totalTasks} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};