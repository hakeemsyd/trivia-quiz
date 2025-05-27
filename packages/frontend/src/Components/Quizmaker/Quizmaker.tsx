import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/index.gql';
import Questions from '../Question/Question';
import PrimaryButton from '../Buttons/PrimaryButton';
import { PrimarySelect } from '../DropDownSelect/index';

export default function QuizMaker() {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [quizParams, setQuizParams] = useState<{
    category: string;
    difficulty: string;
  } | null>(null);
  const difficultyOptions = [
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
  ];
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
        <PrimarySelect
          label="Select Category"
          isCategory
          value={category}
          onChange={setCategory}
          options={data?.getCategories || []}
        />

        <PrimarySelect label="Select Difficulty" value={difficulty} onChange={setDifficulty} options={difficultyOptions} />
        <PrimaryButton disabled={isButtonDisabled} onClick={handleCreateClick}>
          Create
        </PrimaryButton>
      </div>
    </div>
  );
}
