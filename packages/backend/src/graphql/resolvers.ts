import { QuestionModel } from "../models/Question";

export const resolvers = {
  Query: {
    questions: () => QuestionModel.find().exec(),
    question: (_: any, { id }: { id: any }) =>
      QuestionModel.findById(id).exec(),
  },
  Mutation: {
    addQuestion: async (
      _: any,
      {
        input,
      }: {
        input: any;
      }
    ) => {
      const q = new QuestionModel(input);
      await q.save();
      return q;
    },
  },
  Question: {
    id: (q: any) => q._id.toString(),
    createdAt: (q: any) => q.createdAt.toISOString(),
    updatedAt: (q: any) => q.updatedAt.toISOString(),
  },
};
