import type { Request, Response } from "express";
import Joi from "joi";
import Quiz from "../models/Quiz";
import logger from "../utils/logger";
import computedAnswers from "../utils/func";

class QuizzesController {
    static async createQuiz(req: Request, res: Response): Promise<Response> {
        try {
            // validate request body
            const schema = Joi.object({
                question: Joi.string().required(),
                options: Joi.array()
                    .items({
                        points: Joi.number().required(),
                        answer: Joi.string().required()
                    })
                    .length(4)
                    .required()
            });
            const { error, value } = schema.validate(req.body);

            // return error with details if validation fails
            if (error)
                return res.status(422).json({
                    status: "failed",
                    errors: error.details
                });

            // create quiz
            // const quiz = await Quiz.create(value);
            const quiz = new Quiz(value);
            const newlyCreatedQuiz = await quiz.save();

            return res.status(201).json({
                status: "success",
                data: newlyCreatedQuiz
            });
        } catch (error: any) {
            logger.error(error);
            return res.status(500).json({ status: "failed", error: error.message });
        }
    }

    static async fetchQuizzes(req: Request, res: Response): Promise<Response> {
        try {
            const quizzes = await Quiz.find().exec();

            return res.status(200).json({
                status: "success",
                data: quizzes.slice(0, 5)
            });
        } catch (e: any) {
            logger.error(e);
            return res.status(500).json({
                message: "Error fetching quizzes",
                error: e
            });
        }
    }

    static async modifyQuiz(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            // validate request body
            const schema = Joi.object({
                question: Joi.string().required(),
                options: Joi.array()
                    .items({
                        points: Joi.number().required(),
                        answer: Joi.string().required()
                    })
                    .length(4)
                    .required()
            });
            const { error, value } = schema.validate(req.body);

            // return error with details if validation fails
            if (error)
                return res.status(422).json({
                    status: "failed",
                    errors: error.details
                });

            const { question, options } = value;

            const quiz = await Quiz.findById(id).exec();

            if (!quiz)
                return res.status(404).json({
                    success: "failed",
                    message: "Quiz not found"
                });

            quiz.question = question;
            quiz.options = options;

            const updatedQuiz = await quiz.save();

            return res.status(200).json({
                success: true,
                data: updatedQuiz
            });
        } catch (e: any) {
            logger.error(e);
            return res.status(500).json({
                status: "failed",
                message: "Error modifying quiz",
                error: e
            });
        }
    }

    static async deleteQuiz(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const quiz = await Quiz.findById(id).exec();

            if (!quiz)
                return res.status(404).json({
                    success: "failed",
                    message: "Quiz not found"
                });

            await quiz.remove();

            return res.status(200).json({
                success: true,
                msg: "Quiz deleted successfully"
            });
        } catch (e: any) {
            logger.error(e);
            return res.status(500).json({
                status: "failed",
                message: "Error deleting quiz",
                error: e
            });
        }
    }

    static async submitQuiz(req: Request, res: Response): Promise<Response> {
        const schema = Joi.object({
            answers: Joi.array().items(Joi.number()).length(5).required()
        });
        const { error, value } = schema.validate(req.body);

        // return error with details if validation fails
        if (error)
            return res.status(422).json({
                status: "failed",
                errors: error.details
            });

        return res.json({
            status: "success",
            data: computedAnswers(value.answers)
        });
    }
}

export = QuizzesController;
