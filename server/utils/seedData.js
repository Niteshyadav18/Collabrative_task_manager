import { Task, User, Project } from '../models/index.js';

// Sample users data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'developer',
    department: 'Engineering'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'designer',
    department: 'Design'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'manager',
    department: 'Engineering'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'tester',
    department: 'QA'
  },
  {
    name: 'David Brown',
    email: 'david.brown@company.com',
    role: 'developer',
    department: 'Engineering'
  }
];

// Sample projects data
const sampleProjects = [
  {
    name: 'Task Manager App',
    description: 'A collaborative task management application',
    status: 'active',
    priority: 'high',
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-06-30'),
    team_members: [
      { user: 'John Doe', role: 'lead' },
      { user: 'Jane Smith', role: 'designer' },
      { user: 'Sarah Wilson', role: 'tester' }
    ],
    budget: { allocated: 50000, spent: 15000 },
    progress: 35,
    tags: ['web', 'react', 'mongodb'],
    created_by: 'Mike Johnson'
  },
  {
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application',
    status: 'planning',
    priority: 'medium',
    start_date: new Date('2024-03-01'),
    end_date: new Date('2024-12-31'),
    team_members: [
      { user: 'David Brown', role: 'lead' },
      { user: 'John Doe', role: 'developer' }
    ],
    budget: { allocated: 75000, spent: 0 },
    progress: 5,
    tags: ['mobile', 'react-native', 'ios', 'android'],
    created_by: 'Mike Johnson'
  }
];

// Sample tasks data
const sampleTasks = [
  {
    title: 'Design user authentication flow',
    description: 'Create wireframes and mockups for login, signup, and password reset flows',
    assigned_to: 'Jane Smith',
    status: 'completed',
    priority: 'high',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    tags: ['design', 'auth', 'ui/ux'],
    estimated_hours: 16,
    actual_hours: 14,
    created_by: 'Mike Johnson'
  },
  {
    title: 'Implement task CRUD operations',
    description: 'Build REST API endpoints for creating, reading, updating, and deleting tasks',
    assigned_to: 'John Doe',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    tags: ['backend', 'api', 'mongodb'],
    estimated_hours: 20,
    actual_hours: 12,
    created_by: 'Mike Johnson'
  },
  {
    title: 'Set up MongoDB database',
    description: 'Configure MongoDB instance and create initial collections with proper indexing',
    assigned_to: 'David Brown',
    status: 'completed',
    priority: 'high',
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    tags: ['database', 'mongodb', 'setup'],
    estimated_hours: 8,
    actual_hours: 6,
    created_by: 'Mike Johnson'
  },
  {
    title: 'Write unit tests for API endpoints',
    description: 'Create comprehensive test suite for all task management API endpoints',
    assigned_to: 'Sarah Wilson',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    tags: ['testing', 'api', 'quality'],
    estimated_hours: 24,
    created_by: 'Mike Johnson'
  },
  {
    title: 'Implement real-time notifications',
    description: 'Add WebSocket support for real-time task updates and notifications',
    assigned_to: 'John Doe',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    tags: ['realtime', 'websocket', 'notifications'],
    estimated_hours: 16,
    created_by: 'Mike Johnson'
  },
  {
    title: 'Create responsive dashboard',
    description: 'Design and implement a responsive dashboard showing task statistics and charts',
    assigned_to: 'Jane Smith',
    status: 'review',
    priority: 'medium',
    due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    tags: ['frontend', 'dashboard', 'responsive'],
    estimated_hours: 20,
    actual_hours: 18,
    created_by: 'Mike Johnson'
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('Cleared existing data');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Insert sample projects
    const projects = await Project.insertMany(sampleProjects);
    console.log(`Inserted ${projects.length} projects`);

    // Insert sample tasks
    const tasks = await Task.insertMany(sampleTasks);
    console.log(`Inserted ${tasks.length} tasks`);

    console.log('Database seeding completed successfully!');
    
    return {
      users: users.length,
      projects: projects.length,
      tasks: tasks.length
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};