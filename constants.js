const E = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
const C = {
  INVALID_MAIL: "INVALID_MAIL",
  INCORECT_MAIL: "INCORECT_MAIL",
  MAIL_IN_USE: "MAIL_IN_USE",
  MAIL_MISSING: "MAIL_MISSING",
  USERNAME_MISSING: "USERNAME_MISSING",
  VALID_USER: "VALID_USER",
  PASSWORD_MISSING: "PASSWORD_MISSING",
  WEEK_PASSWORD: "WEEK_PASSWORD",
  INCORECT_PASSWORD: "INCORECT_PASSWORD",
};
const existingUser = {
  username: "test83",
  email: "test7@mail.com",
  password: "Test!234",
};

const USER = {
  INVALID_MAIL: {
    ...existingUser,
    email: "invalid",
  },
  INCORECT_MAIL: {
    ...existingUser,
    email: "test71@mail.com",
  },
  MAIL_IN_USE: {
    ...existingUser,
  },
  MAIL_MISSING: {
    ...existingUser,
    email: null,
  },
  USERNAME_MISSING: {
    ...existingUser,
    username: null,
  },
  NEW_USER: {
    username: "test",
    email: "test7898@mail.com",
    password: "Test!234",
  },
  VALID_USER: {
    ...existingUser,
  },
  PASSWORD_MISSING: {
    ...existingUser,
    password: null,
  },
  WEEK_PASSWORD: {
    ...existingUser,
    password: "weekpass",
  },
  INCORECT_PASSWORD: {
    ...existingUser,
    password: "incorect",
  },
};

const EXERCICE = {
  VALID: {
    name: "Bench Press",
    muscle: "Peck",
    type: "body building",
  },
  EXISTING: {
    name: "Push up",
    muscle: "Peck",
    type: "body building",
  },
  EMPTY: {},

  RESTRICTED: {
    owner: "6405edff23eea965e362f00d",
  },
  UPDATE: {
    name: "Push ups",
    muscle: "Peck",
    type: "body building, ",
  },
};

module.exports = {
  E,
  USER,
  EXERCICE,
};
