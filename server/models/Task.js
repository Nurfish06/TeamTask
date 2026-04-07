import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project' // Null means ad-hoc task
  },
  isAdhoc: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Auto-update status based on progress
taskSchema.pre('save', function(next) {
  if (this.progress === 0) {
    this.status = 'Not Started';
  } else if (this.progress > 0 && this.progress < 100) {
    this.status = 'In Progress';
  } else if (this.progress === 100) {
    this.status = 'Completed';
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
