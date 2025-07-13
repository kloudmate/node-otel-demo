import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IColumn extends Document {
  _id: Types.ObjectId;
  id: string;
  title: string;
  authorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new Schema<IColumn>(
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
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Column = mongoose.model<IColumn>('Column', columnSchema);