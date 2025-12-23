import mongoose, { Schema } from "mongoose";

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const userSchema = new Schema(
  {
    name: String,
    age: Number,
    email: String,
    password: String,
    isAdmin: Boolean,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
