const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  profile: {
    bio: {
      type: String,
      maxlength: 200,
    },
    branch: String,
    year: String,
    skills: [String],
    interests: [String],
    github: String,
    linkedin: String,
    profilePic: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  pendingConnections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  gamification: {
    points: {
      type: Number,
      default: 0,
    },
    badges: [String],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
  },
  refreshToken: String,
  emergencyContacts: [{
    name: String,
    phone: String,
  }],
}, {
  timestamps: true,
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
