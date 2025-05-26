import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/index.gql';
import Questions from '../Question/Question';

export default function QuizMaker() {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [quizParams, setQuizParams] = useState<{
    category: string;
    difficulty: string;
  } | null>(null);

  const { data, loading, error } = useQuery(GET_CATEGORIES);

  const isButtonDisabled = !(category && difficulty);

  const handleCreateClick = () => {
    setQuizParams({ category, difficulty });
    setShowQuestions(true);
  };

  const handleBack = () => {
    setShowQuestions(false);
  };

  if (showQuestions) {
    return <Questions category={quizParams?.category} difficulty={quizParams?.difficulty} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">QUIZ MAKER</h1>

      {loading && <p className="text-gray-500">Loading categories...</p>}
      {error && <p className="text-red-500">Failed to load categories</p>}

      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 w-60 px-4 text-gray-700 focus:outline-none bg-white appearance-none border-r border-gray-300"
        >
          <option value="">Select Category</option>
          {data?.getCategories.map((cat: { id: string; name: string }) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="h-10 w-40 px-4 text-gray-700 focus:outline-none bg-white appearance-none border-r border-gray-300"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          disabled={isButtonDisabled}
          onClick={handleCreateClick}
          className={`h-10 px-6 text-sm font-medium transition duration-200 ${
            isButtonDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Create
        </button>
      </div>
    </div>
  );
}
