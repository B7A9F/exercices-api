const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.js");
const { USER } = require("../constants");
const User = require("../models/userModel");

jest.useRealTimers();
require("dotenv").config();
beforeAll(async () => {
  await mongoose.connect(process.env.TESTING_STRING);
});

afterAll(async () => {
  await User.deleteOne({ email: "test7898@mail.com" });
  await mongoose.connection.close();
});

describe("User register", () => {
  it("return status code 400 if invalid mail", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.INVALID_MAIL);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Email not valid");
  });
  it("return status code 400 if email already in use", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.MAIL_IN_USE);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Email already in use");
  });
  it("return status code 400 if week password", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.WEEK_PASSWORD);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Password not strong enough");
  });
  it("return bad request if username is missing ", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.USERNAME_MISSING);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("All fields must be filled");
  });
  it("return bad request if email is missing ", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.MAIL_MISSING);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("All fields must be filled");
  });
  it("return bad request if password is missing ", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.PASSWORD_MISSING);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("All fields must be filled");
  });

  it("should return a 200 and an object with email and token ", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/register")
      .send(USER.NEW_USER);
    expect(statusCode).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        token: expect.any(String),
      })
    );
  });
});

describe("User login", () => {
  it("return status code 400 if mail or password is missing", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send(USER.PASSWORD_MISSING);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("All fields must be filled");
  });

  it("return status code 400 if incorrect mail", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send(USER.INCORECT_MAIL);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Incorrect email");
  });
  it("return status code 400 if All fields must be filled", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send({});
    expect(statusCode).toBe(400);
    expect(body.message).toBe("All fields must be filled");
  });

  it("return status code 400 if incorrect password", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send(USER.INCORECT_PASSWORD);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("Incorrect password");
  });

  it("should return a 200 and an object with email, username and token ", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send(USER.VALID_USER);
    expect(statusCode).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        username: expect.any(String),
        email: expect.any(String),
        token: expect.any(String),
      })
    );
  });
});
