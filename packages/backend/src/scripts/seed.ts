import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { QuestionModel } from '../models/Question';
import { Schema, model, Document } from 'mongoose';
import { CategoryModel } from '../models/Category';

dotenv.config();

interface TriviaApiQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface TriviaApiResponse {
  response_code: number;
  results: TriviaApiQuestion[];
}

interface TriviaCategory {
  id: number;
  name: string;
}

interface TriviaCategoryResponse {
  trivia_categories: TriviaCategory[];
}

interface CategoryDoc extends Document {
  id: number;
  name: string;
}

async function seedCategories(): Promise<void> {
  const existingCount = await CategoryModel.countDocuments();
  if (existingCount > 0) {
    console.log(`Categories already exist (${existingCount}). Skipping.`);
    return;
  }
  const categoriesToInsert = [
    { name: 'General Knowledge', categoryId: 9 },
    { name: 'Entertainment: Film', categoryId: 11 },
    { name: 'Science & Nature', categoryId: 17 },
  ];

  await CategoryModel.insertMany(categoriesToInsert);
  console.log('Inserted categories');
}
async function seedQuestions(): Promise<void> {
  try {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/trivia';
    console.log('Connecting to MongoDB:', mongoUrl);
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    await seedCategories();

    const existingCount = await QuestionModel.countDocuments();
    if (existingCount >= 500) {
      console.log(`At least 500 questions already exist (${existingCount}). Skipping.`);
      await mongoose.disconnect();
      return;
    }

    const batchSize = 50;
    const targetAmount = 300;
    const allowedCategoryIds = [9, 11, 17];
    let allQuestions: any[] = [];

    for (const categoryId of allowedCategoryIds) {
      let fetched = 0;
      while (fetched < targetAmount / 3) {
        console.log(`Fetching ${batchSize} questions for category ${categoryId}...`);
        const res = await fetch(`https://opentdb.com/api.php?amount=${batchSize}&type=multiple&category=${categoryId}`);
        const data = (await res.json()) as TriviaApiResponse;

        if (!data.results || data.results.length === 0) {
          console.log(`No questions returned for category ${categoryId}. Retrying after delay...`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          continue;
        }

        const formatted = data.results.map((q) => {
          const allChoices = [...q.incorrect_answers, q.correct_answer];
          const shuffled = allChoices.sort(() => 0.5 - Math.random());
          return {
            text: q.question,
            difficulty: q.difficulty,
            category: q.category,
            choices: shuffled,
            answerIndex: shuffled.indexOf(q.correct_answer),
          };
        });

        allQuestions = allQuestions.concat(formatted);
        fetched += formatted.length;
        console.log(`Fetched ${fetched}/${targetAmount / 3} for category ${categoryId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      }
    }

    // Final trimming in case we fetched slightly more than target
    const uniqueQuestions = allQuestions.slice(0, targetAmount);
    await QuestionModel.insertMany(uniqueQuestions);
    console.log(`Inserted ${uniqueQuestions.length} questions`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedQuestions();
