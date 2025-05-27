import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/index.gql';
import Questions from '../Question/Question';
import PrimaryButton from '../Buttons/PrimaryButton';
import { PrimarySelect } from '../DropDownSelect/index';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCategory, setDifficulty, setShowQuestions } from '../../store/slices/triviaSlice';

export default function QuizMaker() {
  const dispatch = useAppDispatch();
  const { selectedCategory, selectedDifficulty, showQuestions } = useAppSelector((state) => state.trivia);

  const difficultyOptions = [
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' },
  ];
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  const isButtonDisabled = !(selectedCategory && selectedDifficulty);

  const handleCreateClick = () => {
    dispatch(setShowQuestions(true));
  };

  const handleBack = () => {
    dispatch(setShowQuestions(false));
  };

  if (showQuestions) {
    return <Questions category={selectedCategory} difficulty={selectedDifficulty} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">QUIZ MAKER</h1>

      {loading && <p className="text-gray-500">Loading categories...</p>}
      {error && <p className="text-red-500">Failed to load categories</p>}

      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <PrimarySelect
          label="Select Category"
          value={selectedCategory}
          onChange={(value) => dispatch(setCategory(value))}
          options={data?.getCategories || []}
          isCategory
        />

        <PrimarySelect
          label="Select Difficulty"
          value={selectedDifficulty}
          onChange={(value) => dispatch(setDifficulty(value))}
          options={difficultyOptions}
        />

        <PrimaryButton disabled={isButtonDisabled} onClick={handleCreateClick}>
          Create
        </PrimaryButton>
      </div>
    </div>
  );
}
