import axios from "axios";
import React, {useContext, useEffect, useReducer} from "react";
import {
  HANDLE_DATA,
  SET_LOADING,
  SET_WAITING,
  NO_DATA,
  SET_INDEX,
  CHECK_ANSWER,
  CLOSE_MODAL,
  HANDLE_CHANGE,
} from "./actions";
import reducer from "./reducer";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const initialState = {
  waiting: true,
  loading: false,
  questions: [],
  index: 0,
  correctAnswers: 0,
  error: false,
  isModalOpen: false,
  quiz: {amount: 10, category: "sports", difficulty: "easy"},
};

const AppContext = React.createContext();

const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchQuestions = async (url) => {
    dispatch({type: SET_LOADING});
    const response = await axios(url).catch((err) =>
      console.log(err)
    );
    console.log(response);

    if (response) {
      const data = response.data.results;
      console.log("data => ", data);
      if (data.length > 0) {
        dispatch({type: HANDLE_DATA, payload: data});
      } else {
        dispatch({type: NO_DATA});
      }
    } else {
      dispatch({type: SET_WAITING});
    }
  };

  const nextQuestion = () => {
    dispatch({type: SET_INDEX});
  };

  const checkAnswer = (value) => {
    if (value) {
      dispatch({type: CHECK_ANSWER});
    }
    nextQuestion();
  };

  const closeModal = () => {
    dispatch({type: CLOSE_MODAL});
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch({
      type: HANDLE_CHANGE,
      payload: {name: name, value: value},
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {amount, category, difficulty} = state.quiz;
    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    fetchQuestions(url);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        nextQuestion,
        checkAnswer,
        closeModal,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export {AppContext, AppProvider};
