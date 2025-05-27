import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

export const GET_QUESTIONS = gql`
  query questions($category: String!, $difficulty: String!) {
    getQuestions(category: $category, difficulty: $difficulty) {
      id
      text
      category
      difficulty
      choices
    }
  }
`;

export const SUBMIT_ANSWERS = gql`
mutation SubmitAnswers($answers: [AnswerInput!]!) {
  submitAnswers(answers: $answers) {
    score
    total
    correctAnswers {
      questionId
      correctOption
    }
  }
}`;