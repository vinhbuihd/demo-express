import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: 18 },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ createdAt: -1 });

export const User = mongoose.model("User", userSchema);
