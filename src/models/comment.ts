import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  _id: Types.ObjectId;
  text: string;
  authorId: Types.ObjectId;
  taskId: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);