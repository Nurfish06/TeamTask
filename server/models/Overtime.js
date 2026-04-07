import mongoose from 'mongoose';

const overtimeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  shiftType: {
    type: String,
    enum: ['Morning', 'Afternoon', 'None'],
    default: 'None'
  },
  hoursEarned: {
    type: Number,
    default: 0
  },
  hoursDeducted: {
    type: Number,
    default: 0
  },
  deductionReason: {
    type: String
  },
  netHours: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

overtimeSchema.pre('save', function(next) {
  this.netHours = this.hoursEarned - this.hoursDeducted;
  next();
});

const Overtime = mongoose.model('Overtime', overtimeSchema);
export default Overtime;
