import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Question {
    id: ID!
    text: String!
    choices: [String!]!
    answerIndex: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    questions: [Question!]!
    question(id: ID!): Question
  }

  input NewQuestion {
    text: String!
    choices: [String!]!
    answerIndex: Int!
  }

  type Mutation {
    addQuestion(input: NewQuestion!): Question!
  }
`;
