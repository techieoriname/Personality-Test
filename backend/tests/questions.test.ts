import request from "supertest";
import app from "../src/app";
import db from "./db";

// Pass supertest agent for each test
const agent = request.agent(app);

// Setup connection to the database
beforeAll(async () => await db.connect());
beforeEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("Index route", () => {
    test("should return 401 status error as this is not the base url", (done) => {
        agent.get("/").expect(401).end(done);
    });
});

describe("CRUD Operation for QUIZ", () => {
    test("should return 200 status code and return quiz", (done) => {
        agent
            .get("/v1/quiz/list")
            .expect(200)
            .then(async (response) => {
                expect(response.body.status).toBe("success");
                done();
            });
    });

    test("Should create a new quiz and not throw an error", (done) => {
        agent
            .post("/v1/quiz/create")
            .send({
                question: "What is the capital of India?",
                options: [
                    {
                        points: 5,
                        answer: "Okay"
                    },
                    {
                        points: 3,
                        answer: "Working"
                    },
                    {
                        points: -3,
                        answer: "Not working"
                    },
                    {
                        points: -5,
                        answer: "Leave me alone"
                    }
                ]
            })
            .then((response) => {
                expect(response.body.status).toBe("success");
                done();
            });
    });

    test("Computed result from selected answer points", (done) => {
        const answers = [-5, -5, -5, 3, 5];
        agent
            .post("/v1/quiz/submit")
            .send({
                answers
            })
            .then((response) => {
                expect(typeof response.body.data).toBe("number");
                expect(response.body.status).toBe("success");
                done();
            });
    });
});
