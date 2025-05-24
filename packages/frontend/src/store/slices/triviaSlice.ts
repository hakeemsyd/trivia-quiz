import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface Question {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface TriviaState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  loading: boolean;
  error: string | null;
}

const initialState: TriviaState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  loading: false,
  error: null,
};

// Example async thunk for fetching questions
export const fetchQuestions = createAsyncThunk(
  "trivia/fetchQuestions",
  async (amount: number = 10) => {
    // This will be replaced with actual API call
    const response = await fetch(`/api/questions?amount=${amount}`);
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return response.json();
  }
);

const triviaSlice = createSlice({
  name: "trivia",
  initialState,
  reducers: {
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    answerQuestion: (state, action: PayloadAction<string>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (action.payload === currentQuestion.correct_answer) {
        state.score += 1;
      }
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.score = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.currentQuestionIndex = 0;
        state.score = 0;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch questions";
      });
  },
});

export const { nextQuestion, answerQuestion, resetQuiz } = triviaSlice.actions;
export default triviaSlice.reducer;
