import { useState, useEffect } from 'react';
import { TaskService } from '../lib/api.js';

export const useTasks = (filters) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TaskService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError(null);
      const newTask = await TaskService.createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create task');
      return null;
    }
  };

  const updateTask = async (id, updates) => {
    try {
      setError(null);
      const updatedTask = await TaskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => task._id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update task');
      return null;
    }
  };

  const deleteTask = async (id) => {
    try {
      setError(null);
      await TaskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to delete task');
      return false;
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters?.status, filters?.assignedTo, filters?.search]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: loadTasks
  };
};

export const useTeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await TaskService.getTeamMembers();
        setMembers(data);
      } catch (err) {
        console.error('Failed to load team members:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

  return { members, loading };
};