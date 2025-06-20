import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, assignedTo, search } = req.query;
    let query = {};

    // Apply filters
    if (status && status !== '') {
      query.status = status;
    }

    if (assignedTo && assignedTo !== '') {
      query.assigned_to = assignedTo;
    }

    if (search && search !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, assigned_to, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!assigned_to || !assigned_to.trim()) {
      return res.status(400).json({ error: 'Assigned to is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description || '',
      assigned_to: assigned_to.trim(),
      status: status || 'todo'
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate required fields if they're being updated
    if (updates.title !== undefined && (!updates.title || !updates.title.trim())) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (updates.assigned_to !== undefined && (!updates.assigned_to || !updates.assigned_to.trim())) {
      return res.status(400).json({ error: 'Assigned to cannot be empty' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get unique team members
router.get('/team-members', async (req, res) => {
  try {
    const members = await Task.distinct('assigned_to');
    const filteredMembers = members.filter(member => member && member.trim() !== '');
    res.json(filteredMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;