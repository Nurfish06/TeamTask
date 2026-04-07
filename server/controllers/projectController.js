import asyncHandler from 'express-async-handler';
import Project from '../models/Project.js';

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({});
  res.status(200).json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, quarter, year } = req.body;
  
  const project = new Project({
    name,
    quarter,
    year
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

export const updateProject = asyncHandler(async (req, res) => {
  const { name, quarter, year } = req.body;

  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name || project.name;
    project.quarter = quarter || project.quarter;
    project.year = year || project.year;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.deleteOne();
    res.status(200).json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});
