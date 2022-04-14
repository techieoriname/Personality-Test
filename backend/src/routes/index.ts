import express from "express";
import quizzes from "./quiz.routes";
const router = express.Router();

router.use("/v1/quiz", quizzes);

router.get("/", (req, res) => {
    return res.status(401).json({
        msg: "Boom!!! we're live! you shouldn't be here"
    });
});

router.get("/*", (req, res) => {
    return res.status(404).json({
        404: "Page not found"
    });
});

export default router;
