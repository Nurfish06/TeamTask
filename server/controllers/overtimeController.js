import asyncHandler from 'express-async-handler';
import Overtime from '../models/Overtime.js';
import User from '../models/User.js';

export const getOvertimeLogs = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role !== 'manager') {
    query.user = req.user._id;
  } else {
    if (req.query.user) query.user = req.query.user;
  }

  const logs = await Overtime.find(query).populate('user', 'name email').sort({ date: -1 });
  res.status(200).json(logs);
});

export const createOvertimeLog = asyncHandler(async (req, res) => {
  const { user, date, shiftType, hoursEarned, hoursDeducted, deductionReason } = req.body;
  
  const log = new Overtime({
    user,
    date,
    shiftType,
    hoursEarned,
    hoursDeducted,
    deductionReason
  });

  const createdLog = await log.save();
  const populatedLog = await Overtime.findById(createdLog._id).populate('user', 'name email');
  
  res.status(201).json(populatedLog);
});

export const updateOvertimeLog = asyncHandler(async (req, res) => {
  const log = await Overtime.findById(req.params.id);

  if (log) {
    log.user = req.body.user || log.user;
    log.date = req.body.date || log.date;
    log.shiftType = req.body.shiftType || log.shiftType;
    log.hoursEarned = req.body.hoursEarned !== undefined ? req.body.hoursEarned : log.hoursEarned;
    log.hoursDeducted = req.body.hoursDeducted !== undefined ? req.body.hoursDeducted : log.hoursDeducted;
    log.deductionReason = req.body.deductionReason || log.deductionReason;

    const updatedLog = await log.save();
    const populatedLog = await Overtime.findById(updatedLog._id).populate('user', 'name email');
    res.status(200).json(populatedLog);
  } else {
    res.status(404);
    throw new Error('Overtime log not found');
  }
});

export const deleteOvertimeLog = asyncHandler(async (req, res) => {
  const log = await Overtime.findById(req.params.id);

  if (log) {
    await log.deleteOne();
    res.status(200).json({ message: 'Overtime log removed' });
  } else {
    res.status(404);
    throw new Error('Overtime log not found');
  }
});

export const getOvertimeSummary = asyncHandler(async (req, res) => {
  let matchStage = {};
  if (req.user.role !== 'manager') {
    matchStage.user = req.user._id;
  }

  const summary = await Overtime.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$user',
        totalEarned: { $sum: '$hoursEarned' },
        totalDeducted: { $sum: '$hoursDeducted' },
        netBalance: { $sum: '$netHours' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        userId: '$_id',
        name: '$userInfo.name',
        email: '$userInfo.email',
        totalEarned: 1,
        totalDeducted: 1,
        netBalance: 1
      }
    }
  ]);

  res.status(200).json(summary);
});
