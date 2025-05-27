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
        <div className="relative w-60">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 w-full px-4 pr-10 text-gray-700 bg-white border border-gray-300 appearance-none focus:outline-none"
          >
            <option value="">Select Category</option>
            {data?.getCategories.map((cat: { id: string; name: string }) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-40">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="h-10 w-full px-4 pr-10 text-gray-700 bg-white border border-gray-300 appearance-none focus:outline-none"
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <button
          disabled={isButtonDisabled}
          onClick={handleCreateClick}
          className={`h-10 px-6 text-sm font-medium !rounded-none transition duration-200 
  ${isButtonDisabled ? '!bg-blue-300 text-white !cursor-not-allowed' : '!bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Create
        </button>
      </div>
    </div>
  );
}
