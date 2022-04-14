import express from "express";
import QuizzesController from "../controllers/QuizzesController";

const quiz = express.Router();

quiz.get("/list", QuizzesController.fetchQuizzes);
quiz.post("/create", QuizzesController.createQuiz);
quiz.patch("/update/:id", QuizzesController.modifyQuiz);
quiz.delete("/delete/:id", QuizzesController.deleteQuiz);
quiz.post("/submit", QuizzesController.submitQuiz);

export default quiz;
