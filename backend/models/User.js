const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minLength: 3,
      maxLength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z]+[\w-_\.]*[a-zA-z0-9]+@[a-zA-Z]{2,}[\w]*\.[a-zA-Z]{2,4}$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },

    password: {
      type: String,
    },

    photoURL: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/videoapp-d0318.appspot.com/o/user.jpg?alt=media&token=c9647c9b-bdd4-4281-a3f9-c92bd95411af",
    },

    subscribers: {
      type: Number,
      default: 0,
    },

    subscribedUsers: {
      type: [String],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
