import { QuestionModel } from '../models/Question';
import { CategoryModel } from '../models/Category';

export const resolvers = {
  Query: {
    questions: () => QuestionModel.find().exec(),
    question: (_: any, { id }: { id: any }) => QuestionModel.findById(id).exec(),
    getQuestions: async (_: any, args: { category: string; difficulty: string }) => {
      const match: any = {};
      if (args.category) {
        match.category = args.category;
      }
      if (args.difficulty) {
        match.difficulty = args.difficulty;
      }

      return await QuestionModel.aggregate([{ $match: match }, { $sample: { size: 5 } }]);
    },
    getCategories: async () => {
      const categories = await CategoryModel.find().exec();
      console.log('Fetched categories from DB:', categories);
      const filtered = categories.filter((cat) => !!cat.name);

      return filtered.map((cat) => ({
        id: cat._id.toString(),
        categoryId: cat.categoryId,
        name: cat.name,
      }));
    },
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
    submitAnswers: async (_: any, { answers }: { answers: { questionId: string; selectedOption: number }[] }) => {
      const questionIds = answers.map((a) => a.questionId);

      const questions = await QuestionModel.find({ _id: { $in: questionIds } });

      let score = 0;
      const correctAnswers = [];

      for (const { questionId, selectedOption } of answers) {
        const question = questions.find((q) => q._id.toString() === questionId);
        if (!question) continue;

        if (selectedOption === question.answerIndex) {
          score++;
        }

        correctAnswers.push({
          questionId,
          correctOption: question.answerIndex,
        });
      }

      return {
        score,
        total: answers.length,
        correctAnswers,
      };
    },
  },
  Question: {
    id: (q: any) => q._id.toString(),
    createdAt: (q: any) => q.createdAt.toISOString(),
    updatedAt: (q: any) => q.updatedAt.toISOString(),
  },
};
