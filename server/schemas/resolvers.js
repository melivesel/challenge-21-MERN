const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Define query resolvers here
    me: async (parent, args, context) => {
      try {
        if (context.user) {
          console.log(context.user._id);

          const user = await User.findById(context.user._id);
          return user;
        }
      } catch (err) {
        console.log(err);
        throw new Error('Not authenticated');
      }
    },
  },
  Mutation: {
    addUser: async (parent, args, context, info) => {

      console.log(args, context)
      const user = await User.create(args);


      if (!user) {
        throw new Error('Something went wrong while creating the user!');
      }

      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, args, context, info) => {

      const user = await User.findOne({ $or: [{ email: args.email }] });

      if (!user) {
        throw new Error("User not found!");
      }

      const correctPw = await user.isCorrectPassword(args.password);

      if (!correctPw) {
        throw new Error('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, context, info) => {
      const { input } = args;
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
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