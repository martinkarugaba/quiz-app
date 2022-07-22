import {
  CHECK_ANSWER,
  HANDLE_DATA,
  NO_DATA,
  SET_INDEX,
  SET_LOADING,
  SET_WAITING,
  CLOSE_MODAL,
  HANDLE_CHANGE,
} from "./actions";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {...state, loading: true, waiting: false};

    case SET_WAITING:
      return {...state, waiting: false};

    case HANDLE_DATA:
      console.log("payload data = ", action.payload);
      return {
        ...state,
        questions: action.payload,
        loading: false,
        waiting: false,
        error: false,
      };

    case NO_DATA:
      return {...state, waiting: true, error: true};

    case SET_INDEX:
      let newIndex = state.index + 1;
      if (newIndex > state.questions.length - 1) {
        newIndex = 0;
        return {...state, index: newIndex, isModalOpen: true};
      } else {
        return {...state, index: newIndex};
      }

    case CHECK_ANSWER:
      let newCorrectAnswers = state.correctAnswers + 1;
      return {...state, correctAnswers: newCorrectAnswers};

    case CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
        waiting: true,
        correctAnswers: 0,
      };

    case HANDLE_CHANGE:
      return {
        ...state,
        quiz: {...state.quiz, [action.payload.name]: action.payload.value},
      };

    default:
      throw new Error(`no matching "${action.type}" action type`);
  }
};

export default reducer;
