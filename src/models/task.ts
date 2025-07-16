import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITask extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  description: string;
  authorId: Types.ObjectId;
  columnId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: 'Column',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model<ITask>('Task', taskSchema);