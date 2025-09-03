import Options from "./Options";

function Question({ question, dispatch, answer }) {
  return (
    <div>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
      ></Options>
    </div>
  );
}

export default Question;
