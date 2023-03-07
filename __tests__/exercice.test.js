const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.js");
const { EXERCICE, USER } = require("../constants.js");
const Exercice = require("../models/exercicesModel");

require("dotenv").config();

let token;
const exerciceRequest = async ({ endpoint, method, data, status, message }) => {
  const req = {
    GET: request(app).get(endpoint),
    POST: request(app).post(endpoint).send(data),
    PUT: request(app).put(endpoint).send(data),
    DELETE: request(app).delete(endpoint),
  };
  const { body, statusCode } = await req[method]
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/);
  expect(statusCode).toBe(status);
  if (message) {
    expect(body.message).toBe(message);
  }
  return body;
};

beforeEach(async () => {
  await mongoose.connect(process.env.TESTING_STRING);
  const { body } = await request(app)
    .post("/api/users/login")
    .send(USER.VALID_USER);
  token = body.token;
});

afterEach(async () => {
  await Exercice.deleteOne({ ...EXERCICE.VALID });
  await mongoose.connection.close();
});

describe("Auth ", () => {
  it("should require auth", async () => {
    const { body, statusCode } = await request(app).get("/api/exercices/");
    expect(statusCode).toBe(401);
    expect(body.message).toBe("Token is missing");
  });
});

describe("Exercices from multiple sources", () => {
  it("return status code 200 and an array of exercices", async () => {
    const body = await exerciceRequest({
      endpoint: "/api/exercices",
      method: "GET",
      status: 200,
    });
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          type: expect.any(String),
          muscle: expect.any(String),
        }),
      ])
    );
  });
});

describe("Local exercices", () => {
  it("return status code 200 and an array of exercices", async () => {
    const body = await exerciceRequest({
      endpoint: "/api/exercices/local",
      method: "GET",
      status: 200,
    });
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          name: expect.any(String),
          type: expect.any(String),
          muscle: expect.any(String),
        }),
      ])
    );
  });
});
describe("Remote exercices", () => {
  it("return status code 200 and an array of exercices", async () => {
    const body = await exerciceRequest({
      endpoint: "/api/exercices/remote",
      method: "GET",
      status: 200,
    });
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          type: expect.any(String),
          muscle: expect.any(String),
        }),
      ])
    );
  });
});

describe("Create Exercice", () => {
  it("return status code 400 if empty fields", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices",
      method: "POST",
      data: EXERCICE.EMPTY,
      status: 400,
      message: "name, type and muscle fields are mandatory !",
    });
  });
  it("return status code 400 if exercice already exist", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices",
      method: "POST",
      data: EXERCICE.EXISTING,
      status: 400,
      message: "Exercice already exist, you can delete or update it by id.",
    });
  });
  it("return status code 201 and exercice object", async () => {
    const body = await exerciceRequest({
      endpoint: "/api/exercices",
      method: "POST",
      data: EXERCICE.VALID,
      status: 201,
    });
    expect(body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        type: expect.any(String),
        muscle: expect.any(String),
      })
    );
  });
});

describe("Get Exercice", () => {
  it("return status code 500 if invalid id", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405edff2300e",
      method: "GET",
      status: 500,
      message: "error",
    });
  });
  it("return status code 404 if exercice not found", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405edff23eea965e362f00e",
      method: "GET",
      status: 404,
      message: "Exercice not found",
    });
  });
  it("return status code 200 and exercice object", async () => {
    const body = await exerciceRequest({
      endpoint: "/api/exercices/6405e722651f1ae9ca692a34",
      method: "GET",
      status: 200,
    });
    expect(body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        type: expect.any(String),
        muscle: expect.any(String),
      })
    );
  });
});

describe("Update Exercice", () => {
  it("return status code 403 if exercice added by someone else", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405edff23eea965e362f00d",
      method: "PUT",
      data: EXERCICE.UPDATE,
      status: 403,
      message: "User don't have permission to update other user exercices",
    });
  });
  it("return status code 500 if invalid id", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405edff2300e",
      method: "PUT",
      data: EXERCICE.UPDATE,
      status: 500,
      message: "error",
    });
  });
  it("return status code 404 if exercice not found", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405ee7723eea9653362f00e",
      method: "PUT",
      data: EXERCICE.UPDATE,
      status: 404,
      message: "Exercice not found",
    });
  });
  it("return status code 200 and exercice object", async () => {
    const body = await exerciceRequest({
      endpoint: "/api/exercices/6405ee7723eea965e362f00e",
      method: "PUT",
      data: EXERCICE.UPDATE,
      status: 200,
    });
    expect(body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        type: expect.any(String),
        muscle: expect.any(String),
      })
    );
  });
});

describe("Delete Exercice", () => {
  let exerciceId;
  beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_STRING);

    const ex = await Exercice.create({
      name: "DeadLift",
      muscle: "back",
      type: "powerlifting",
      owner: "640539cf5dc7bc14c55d1e9c",
    });
    exerciceId = ex._id;
  });

  it("return status code 404 if exercice not found", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405edff23eea965e362f00e",
      method: "DELETE",
      status: 404,
      message: "Exercice not found",
    });
  });
  it("return status code 403 if exercice added by someone else", async () => {
    await exerciceRequest({
      endpoint: "/api/exercices/6405edff23eea965e362f00d",
      method: "DELETE",
      status: 403,
      message: "User don't have permission to update other user exercices",
    });
  });
  it("return status code 200 and exercice object", async () => {
    const body = await exerciceRequest({
      endpoint: `/api/exercices/${exerciceId}`,
      method: "DELETE",
      status: 200,
    });
    expect(body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        type: expect.any(String),
        muscle: expect.any(String),
      })
    );
  });
});
