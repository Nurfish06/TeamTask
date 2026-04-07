import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

export const getTasks = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role !== 'manager') {
    query.assignedTo = req.user._id;
  } else {
    // Optional filters for manager
    if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;
    if (req.query.status) query.status = req.query.status;
  }

  const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('project', 'name');
  res.status(200).json(tasks);
});

export const createTask = asyncHandler(async (req, res) => {
  const { name, category, description, dueDate, assignedTo, project, isAdhoc } = req.body;
  
  const task = new Task({
    name,
    category,
    description,
    dueDate,
    assignedTo,
    project: project || null,
    isAdhoc: isAdhoc || false
  });

  const createdTask = await task.save();
  const populatedTask = await Task.findById(createdTask._id)
    .populate('assignedTo', 'name email')
    .populate('project', 'name');
    
  res.status(201).json(populatedTask);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if member is updating, they can only update progress
    if (req.user.role === 'member') {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to update this task');
      }
      task.progress = req.body.progress !== undefined ? req.body.progress : task.progress;
    } else {
      // Manager can update everything
      task.name = req.body.name || task.name;
      task.category = req.body.category || task.category;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
      task.project = req.body.project !== undefined ? req.body.project : task.project;
      task.isAdhoc = req.body.isAdhoc !== undefined ? req.body.isAdhoc : task.isAdhoc;
      task.progress = req.body.progress !== undefined ? req.body.progress : task.progress;
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
      
    res.status(200).json(populatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    await task.deleteOne();
    res.status(200).json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});
