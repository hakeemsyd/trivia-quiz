import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Query {
    questions: [Question!]!
    question(id: ID!): Question
    getCategories: [Category!]!
    getQuestions(category: String!, difficulty: String!): [Question!]!
  }

  type Mutation {
    addQuestion(input: NewQuestion!): Question!
    submitAnswers(answers: [AnswerInput!]!): ScoreResult!
  }

  input NewQuestion {
    text: String!
    choices: [String!]!
    answerIndex: Int!
    category: String!
    difficulty: String!
  }

  type Question {
    id: ID!
    text: String!
    category: String!
    difficulty: String!
    choices: [String!]!
    answerIndex: Int!
    createdAt: String!
    updatedAt: String!
  }

  input AnswerInput {
    questionId: ID!
    selectedOption: Int!
  }

  type ScoreResult {
    score: Int!
    total: Int!
    correctAnswers: [CorrectAnswer!]!
  }

  type CorrectAnswer {
    questionId: ID!
    correctOption: String!
  }

  type Category {
    id: ID!
    categoryId: Int!
    name: String!
  }
`;
