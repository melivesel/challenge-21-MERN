const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
authMiddleWare: function({req}) {
let token = req.body.token || req.query.token || req.headers.authorization;

if (req.headers.authorization) {
  token = token.split("").pop().trim();
}

if (!token) {
  return req;
}
try {
const { data } = jwt.verify(token, secret, {maxAge: expiration});
req.user= data;
} catch {
  console.log("Invalid Token");
}
return req;

},
  signToken: function ({ _id, email, username}) {
    const payload = { _id, email, username}; 
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};