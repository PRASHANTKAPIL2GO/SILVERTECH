const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Core user account data. Passwords are hashed before save via a pre-save hook.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // Never return the password field in query results by default
      select: false,
    },
    comfortLevel: {
      type: String,
      enum: {
        values: ['beginner', 'medium', 'advanced'],
        message: 'Comfort level must be beginner, medium, or advanced',
      },
      default: 'beginner',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

/**
 * Pre-save hook: Hash the password before storing it.
 * Only runs if the password field has been modified (avoids re-hashing on other updates).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare a plain-text password against the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
