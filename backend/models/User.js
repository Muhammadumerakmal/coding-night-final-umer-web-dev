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
userSchema.pre("save", async function () {
  console.log("Pre-save hook triggered for user:", this.username);
  if (!this.isModified("password")) {
    console.log("Password not modified, skipping hash");
    return;
  }
  console.log("Hashing password...");

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed successfully");
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
