import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    supportRole: {
      type: String,
      enum: ["Need Help", "Can Help", "Both"],
    },
    engagementMetrics: {
      contributions: {
        type: Number,
        default: 0,
      },
      trustScore: {
        type: Number,
        default: 0,
      },
      badges: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
