const beautifyUnique = require('mongoose-beautiful-unique-validation');
const { Schema, model } = require('mongoose');
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: `Name is required`,
      trim: true
    },
    email: {
      type: String,
      required: `Email is required`,
      unique: `{VALUE} is already taken`,
      trim: true
    },
    password: {
      type: String,
      required: `Password is required`,
      minlength: [6, `Please enter a password that is more than 6 character`]
    }
  },
  { timestamps: true }
);
UserSchema.plugin(beautifyUnique);

module.exports = model('User', UserSchema);
