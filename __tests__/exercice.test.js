const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app.js");
const { EXERCICE, USER } = require("../constants.js");
const Exercice = require("../models/exercicesModel");

require("dotenv").config();

let token;

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
    const { body, statusCode } = await request(app)
      .get("/api/exercices")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(200);
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
    const { body, statusCode } = await request(app)
      .get("/api/exercices/local")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(200);
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
    const { body, statusCode } = await request(app)
      .get("/api/exercices/remote")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(200);
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
    const { body, statusCode } = await request(app)
      .post("/api/exercices")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.EMPTY)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(400);
    expect(body.message).toBe("name, type and muscle fields are mandatory !");
  });
  it("return status code 400 if exercice already exist", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/exercices")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.EXISTING)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(400);
    expect(body.message).toBe(
      "Exercice already exist, you can delete or update it by id."
    );
  });
  it("return status code 201 and exercice object", async () => {
    const { body, statusCode } = await request(app)
      .post("/api/exercices")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.VALID)
      .expect("Content-Type", /json/);

    expect(statusCode).toBe(201);
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
    const { body, statusCode } = await request(app)
      .get("/api/exercices/6405edff2300e")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(500);
    expect(body.message).toBe("error");
  });
  it("return status code 404 if exercice not found", async () => {
    const { body, statusCode } = await request(app)
      .get("/api/exercices/6405edff23eea965e362f00e")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(404);
    expect(body.message).toBe("Exercice not found");
  });
  it("return status code 200 and exercice object", async () => {
    const { body, statusCode } = await request(app)
      .get("/api/exercices/6405e722651f1ae9ca692a34")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(200);
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
    const { body, statusCode } = await request(app)
      .put("/api/exercices/6405edff23eea965e362f00d")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.UPDATE)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(403);
    expect(body.message).toBe(
      "User don't have permission to update other user exercices"
    );
  });
  it("return status code 500 if invalid id", async () => {
    const { body, statusCode } = await request(app)
      .put("/api/exercices/6405edff2300e")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.UPDATE)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(500);
    expect(body.message).toBe("error");
  });
  it("return status code 404 if exercice not found", async () => {
    const { body, statusCode } = await request(app)
      .put("/api/exercices/6405edff23eea965e362f00e")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.UPDATE)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(404);
    expect(body.message).toBe("Exercice not found");
  });
  it("return status code 200 and exercice object", async () => {
    const { body, statusCode } = await request(app)
      .put("/api/exercices/6405ee7723eea965e362f00e")
      .set("Authorization", `Bearer ${token}`)
      .send(EXERCICE.UPDATE)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(200);
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
    const { body, statusCode } = await request(app)
      .delete("/api/exercices/6405edff23eea965e362f00e")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(404);
    expect(body.message).toBe("Exercice not found");
  });
  it("return status code 403 if exercice added by someone else", async () => {
    const { body, statusCode } = await request(app)
      .delete("/api/exercices/6405edff23eea965e362f00d")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(403);
    expect(body.message).toBe(
      "User don't have permission to update other user exercices"
    );
  });
  it("return status code 200 and exercice object", async () => {
    const { body, statusCode } = await request(app)
      .delete("/api/exercices/" + exerciceId)
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/);
    expect(statusCode).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        type: expect.any(String),
        muscle: expect.any(String),
      })
    );
  });
});
