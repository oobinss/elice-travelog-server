import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    info: {
      type: String,
    },
  },
  {
    collection: 'categories',
    timestamps: true,
  }
);

export { CategorySchema };
