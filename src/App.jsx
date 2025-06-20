import React, { useState } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import { useTasks, useTeamMembers } from './hooks/useTasks.js';
import { TaskCard } from './components/TaskCard.jsx';
import { CreateTaskModal } from './components/CreateTaskModal.jsx';
import { TaskFilters } from './components/TaskFilters.jsx';
import { TaskStats } from './components/TaskStats.jsx';
import { ConnectionStatus } from './components/ConnectionStatus.jsx';

function App() {
  const [filters, setFilters] = useState({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(filters);
  const { members: teamMembers } = useTeamMembers();

  const handleCreateTask = async (taskData) => {
    await createTask(taskData);
  };

  const handleUpdateTask = async (id, updates) => {
    await updateTask(id, updates);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-xl">
              <CheckSquare size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-gray-600">Collaborative Task Management</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
          >
            <Plus size={20} />
            New Task
          </button>
        </div>

        {/* Connection Status */}
        <ConnectionStatus />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        {/* Stats */}
        <TaskStats tasks={tasks} />

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          teamMembers={teamMembers}
          totalTasks={tasks.length}
        />

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <CheckSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-6">
                {Object.keys(filters).some(key => filters[key])
                  ? 'Try adjusting your filters or create a new task to get started.'
                  : 'Create your first task to get started with TaskFlow.'}
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />
      </div>
    </div>
  );
}

export default App;