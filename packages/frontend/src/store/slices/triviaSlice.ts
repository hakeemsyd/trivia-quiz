import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import client from '../../../src/client/apolloClient';
import { SUBMIT_ANSWERS } from '../../graphql/index.gql';

interface CorrectAnswer {
  questionId: string;
  correctOption: number;
}

interface QuizResult {
  score: number;
  total: number;
  correctAnswers: CorrectAnswer[];
}

interface TriviaState {
  selectedCategory: string;
  selectedDifficulty: string;
  showQuestions: boolean;
  selectedAnswers: { [questionId: string]: number };
  quizResult: QuizResult | null;
  correctAnswers: CorrectAnswer[];
  submitting: boolean;
}

const initialState: TriviaState = {
  selectedCategory: '',
  selectedDifficulty: '',
  showQuestions: false,
  selectedAnswers: {},
  quizResult: null,
  correctAnswers: [],
  submitting: false,
};

export const submitAnswersThunk = createAsyncThunk('trivia/submitAnswers', async (_, { getState }) => {
  const state = getState() as { trivia: TriviaState };
  const answers = Object.entries(state.trivia.selectedAnswers).map(([questionId, selectedOption]) => ({
    questionId,
    selectedOption,
  }));

  const { data } = await client.mutate({
    mutation: SUBMIT_ANSWERS,
    variables: { answers },
  });

  return data.submitAnswers;
});

const triviaSlice = createSlice({
  name: 'trivia',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setDifficulty: (state, action: PayloadAction<string>) => {
      state.selectedDifficulty = action.payload;
    },
    setShowQuestions: (state, action: PayloadAction<boolean>) => {
      state.showQuestions = action.payload;
    },
    setSelectedAnswer: (state, action: PayloadAction<{ questionId: string; optionIndex: number }>) => {
      const { questionId, optionIndex } = action.payload;
      state.selectedAnswers[questionId] = optionIndex;
    },
    resetQuiz: (state) => {
      state.selectedAnswers = {};
      state.quizResult = null;
      state.correctAnswers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAnswersThunk.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitAnswersThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.quizResult = {
          score: action.payload.score,
          total: action.payload.total,
          correctAnswers: action.payload.correctAnswers || [],
        };
        state.correctAnswers = action.payload.correctAnswers || [];
      })
      .addCase(submitAnswersThunk.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const { setCategory, setDifficulty, setShowQuestions, setSelectedAnswer, resetQuiz } = triviaSlice.actions;
export default triviaSlice.reducer;
