//importing testing file
const app = require("../server");
// const rout = require('../Routes/user');

const userroutes = require("../Routes/user");
const serviceroutes = require("../Routes/service");
app.use("/user", userroutes);
app.use("/service", serviceroutes);

const chai = require("chai");
const expect = require("chai").expect;

const chaiHttp = require("chai-http");

chai.use(chaiHttp);
// const expect = chai.expect
const request = require("supertest");

const assert = require("assert");

const { describe, beforeAll, afterAll, it } = require("mocha");

//for second test case
const express = require("express");
const { MongoClient } = require("mongodb");

const PORT = 5000;

describe("GET /", () => {
  it("should return 200 and message", (done) => {
    request(app)
      .get("/")
      .expect(200)
      .end((err, res) => {
        assert.equal(res.text, `added all env i think`);
        done(err);
      });
  });
});

describe("POST /chandra/signin", () => {
  it("should return a token if email and password are correct", (done) => {
    const data = {
      userEmail: "rishik.b20@iiits.in",
      userPassword: "123456789",
    };
    request(app)
      .post("/user/chandra/signin")
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check if response body has jwtToken property
        expect(res.body).to.have.property("jwtToken");
        done();
      });
  });

  it("should return an error message if password is incorrect", (done) => {
    const data = {
      userEmail: "rishik.b20@iiits.in",
      userPassword: "wrongpassword",
    };
    request(app)
      .post("/user/chandra/signin") // modify the route to include '/user'
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check if response body has errors array with "Password is incorrect" message
        expect(res.body.errors).to.include("Password is incorrect");
        done();
      });
  });

  it("should return an error message if email is not found", (done) => {
    const data = {
      userEmail: "nonexistent@example.com",
      userPassword: "testpassword",
    };
    request(app)
      .post("/user/chandra/signin") // modify the route to include '/user'
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check if response body has errors array with "Email is not found" message
        expect(res.body.errors).to.include("Email is not found");
        done();
      });
  });
});

describe("GET /", () => {
  it("should return an array of services", (done) => {
    chai
      .request(app)
      .get("/service/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body[0]).to.have.property("seller");
        done();
      });
  });
});

describe("POST /forgot", () => {
  it("should return user information when a valid email is provided", (done) => {
    const user = { email: "pcssai7093@gmail.com" };
    request(app)
      .post("/user/forgot")
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.deepEqual(res.body, false);
        // assert.deepEqual(res.body[0].email, user.email);

        done();
      });
  });

  it("should return an empty array when an email that is not in the database is provided", (done) => {
    const user = { email: "abc@gmail.com" };
    request(app)
      .post("/user/forgot")
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.deepEqual(res.body, true);
        done();
      });
  });
});

describe("GET /", () => {
  it("should return all users", (done) => {
    request(app)
      .get("/user/")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        done();
      });
  });
});

// after(async () => {
//   await app.close(); // close the server connection
// });

// describe("POST /user/signup", () => {
//   it("should create a new user and return a token", (done) => {
//     const user = {
//       username: "testuser",
//       fullname: "Test User",
//       email: "testuser@gmail.com",
//       password: "password"
//     };
//     request(app)
//       .post("/user/chandra/signup")
//       .send(user)
//       .expect(200)
//       .then((response) => {
//         assert.ok(response.body.token);
//         done();
//       })
//       .catch((err) => done(err));
//   });
// });
