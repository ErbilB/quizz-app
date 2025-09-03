import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";

export default function Quizz() {
  const initialState = {
    questions: [],
    //loading, ready, error, active, finished
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highscore: 0,
  };

  function reducer(state, action) {
    switch (action.type) {
      case "dataRecieved":
        return {
          ...state,
          questions: action.payload,
          status: "ready",
        };

      case "dataFailed":
        return {
          ...state,
          status: "error",
        };

      case "start":
        return { ...state, status: "active" };
      case "newAnswer":
        const question = state.questions.at(state.index);
        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };

      case "nextQuestion":
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        };

      case "finished":
        const newScore =
          state.points > state.highscore ? state.points : state.highscore;
        return {
          ...state,
          status: "finished",
          highscore: newScore,
        };

      case "reset":
        return {
          ...initialState,
          questions: state.questions,
          status: "ready",
          highscore: state.highscore,
        };
      default:
        throw new Error("Action is unknown");
    }
  }

  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(function () {
    fetch("http://localhost:8005/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  console.log(status);

  return (
    <div className="app">
      <Header></Header>
      <Main>
        {status === "loading" && <Loader></Loader>}
        {status === "error" && <Error></Error>}
        {status === "ready" && (
          <StartScreen
            numQuestion={questions.length}
            dispatch={dispatch}
          ></StartScreen>
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={questions.length}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            ></Progress>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            ></Question>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestion={questions.length}
              index={index}
            ></NextButton>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          ></FinishScreen>
        )}
      </Main>
    </div>
  );
}
