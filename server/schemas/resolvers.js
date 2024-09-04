const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Define query resolvers here
  },
  Mutation: {
    addUser: async (parent, args, context, info) => {
      const { body } = args;
      const user = await User.create(body);

      if (!user) {
        throw new Error('Something went wrong while creating the user!');
      }

      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, args, context, info) => {
      const { body } = args;
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

      if (!user) {
        throw new Error("User not found!");
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        throw new Error('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, context, info) => {
      const { user, body } = args;
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: body } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    removeBook: async (parent, args, context, info) => {
      const { user, params } = args;
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found!");
      }

      return updatedUser;
    },
  },
};

module.exports = resolvers;