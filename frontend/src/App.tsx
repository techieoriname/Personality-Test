import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { QuizType } from "./types";

const baseURL = import.meta.env.VITE_APP_SERVER_URL;

function App() {
    const [questions, setQuestions] = useState<QuizType[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    // const currentSelectedAnswerIndex = useRef<number | null>(null);
    const [currentSelectedAnswerIndex, setCurrentSelectedAnswerIndex] = useState<number | null>(
        null
    );

    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    const [finalResult, setFinalResult] = useState<number>(0);

    const [completed, setCompleted] = useState<boolean>(false);

    useEffect(() => {
        axios
            .get(`${baseURL}/quiz/list`)
            .then(({ data }) => {
                setQuestions(data.data);
            })
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        // reset current selected answer if question has not been taken before
        if (typeof selectedAnswers[currentQuestionIndex] === "undefined") {
            setCurrentSelectedAnswerIndex(null);
        } else {
            setCurrentSelectedAnswerIndex(selectedAnswers[currentQuestionIndex]);
        }
    }, [currentQuestionIndex]);

    useEffect(() => {
        // run only when selectedAnswers is updated and questions have been fetched
        if (selectedAnswers.length === questions.length && questions.length > 0) {
            axios
                .post(`${baseURL}/quiz/submit`, {
                    answers: selectedAnswers.map(
                        (answer, index) => questions[index].options[answer].points
                    )
                })
                .then(({ data }) => {
                    setFinalResult(data.data);
                });
            setCompleted(true);
        }
    }, [selectedAnswers]);

    const onNextQuestion = () => {
        // update answer
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = currentSelectedAnswerIndex as number;
        setSelectedAnswers(newAnswers);

        // navigate to next question
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    const onPreviousQuestion = () => {
        // navigate to previous question
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const onSubmitQuiz = () => {
        // get all current answers
        const newAnswers = [...selectedAnswers];
        //add newly selected answer
        newAnswers[currentQuestionIndex] = currentSelectedAnswerIndex as number;

        // update state: Effect is automatically triggered
        setSelectedAnswers(newAnswers);
    };

    // reset quiz to be retaken
    const resetQuiz = () => {
        setSelectedAnswers([]);
        setCurrentQuestionIndex(0);
        setCompleted(false);
    };

    return (
        <div className="w-full space-y-5 pt-20">
            <h2 className="text-center text-4xl font-bold uppercase">
                Are you an introvert or an extrovert?
            </h2>
            <div className="flex w-full justify-center">
                {/*Show questions if user hasn't completed test*/}
                {!completed && (
                    <div className="w-11/12/8 bg-gray-100 py-5 px-10 lg:w-1/2">
                        <p>
                            Question: {currentQuestionIndex + 1}/{questions.length}
                        </p>
                        <div className="flex flex-wrap justify-center">
                            {questions.length > 0 && (
                                <div className="p-4">
                                    <h4 className="text-center text-xl font-bold uppercase">
                                        {questions[currentQuestionIndex].question}
                                    </h4>
                                    <div className="flex flex-col flex-wrap justify-center space-y-4 py-5 transition-all duration-500 ease-in-out">
                                        {questions[currentQuestionIndex].options.map(
                                            (answer, index) => (
                                                <div
                                                    className={`rounded-md py-2 pl-2 pr-4 ${
                                                        currentSelectedAnswerIndex === index
                                                            ? "bg-blue-100 font-bold text-blue-500 transition-all duration-500 ease-in-out"
                                                            : "bg-white"
                                                    }`}
                                                    key={index}
                                                >
                                                    <label
                                                        id={`answer-${index}`}
                                                        className="flex cursor-pointer items-center gap-x-2 text-left"
                                                    >
                                                        <input
                                                            id={`answer-${index}`}
                                                            type="radio"
                                                            name="address"
                                                            value={index}
                                                            checked={
                                                                currentSelectedAnswerIndex === index
                                                            }
                                                            onChange={() => {
                                                                setCurrentSelectedAnswerIndex(
                                                                    index
                                                                );
                                                            }}
                                                        />
                                                        <span>{answer.answer}</span>
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <div
                                        className={`flex ${
                                            currentQuestionIndex === 0
                                                ? "justify-end"
                                                : currentQuestionIndex === questions.length
                                                ? "justify-start"
                                                : "justify-between"
                                        }`}
                                    >
                                        {currentQuestionIndex !== 0 && (
                                            <button
                                                onClick={() => onPreviousQuestion()}
                                                className="button__inactive"
                                            >
                                                Previous
                                            </button>
                                        )}
                                        {currentQuestionIndex < questions.length - 1 && (
                                            <button
                                                className="button__active"
                                                onClick={() => onNextQuestion()}
                                                disabled={currentSelectedAnswerIndex === null}
                                            >
                                                Next Question
                                            </button>
                                        )}
                                        {currentQuestionIndex === questions.length - 1 && (
                                            <button
                                                onClick={() => onSubmitQuiz()}
                                                className="button__active"
                                            >
                                                Finish Test
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/*Show results*/}
                {completed && (
                    <div className="w-5/6 bg-gray-100 py-5 px-10 lg:w-1/2">
                        <h1 className="text-center text-xl">You have completed the test!</h1>
                        <div className="flex justify-center">
                            <div className="w-full space-y-10">
                                <h2 className="text-center text-xl font-semibold uppercase">
                                    {finalResult > 0 ? (
                                        <span>You are an introvert</span>
                                    ) : (
                                        <span>You are an extrovert</span>
                                    )}
                                </h2>
                                <button
                                    className="button__inactive mx-auto w-full"
                                    onClick={() => resetQuiz()}
                                >
                                    Retake test
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
