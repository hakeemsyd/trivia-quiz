import {  useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_QUESTIONS, SUBMIT_ANSWERS } from '../../graphql/index.ts';
import PrimaryButton from '../Buttons/PrimaryButton';

interface QuestionsProps {
  category: string;
  difficulty: string;
  onBack: () => void;
}

interface AnswerInput {
  questionId: string;
  selectedOption: number;
}

interface CorrectAnswer {
  questionId: string;
  correctOption: number;
}

const Question = ({ category, difficulty, onBack }: QuestionsProps) => {
  const { data, loading, error } = useQuery(GET_QUESTIONS, {
    variables: { category, difficulty },
  });

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [result, setResult] = useState<null | {
    score: number;
    total: number;
    correctAnswers: {
      questionId: string;
      correctOption: number;
    }[];
  }>(null);
  const [correctAnswers, setCorrectAnswers] = useState<CorrectAnswer[]>([]);

  const [submitAnswers, { loading: submitting }] = useMutation(SUBMIT_ANSWERS);

  const handleOptionClick = (questionId: string, optionIndex: number) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    const answers: AnswerInput[] = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      const { data } = await submitAnswers({ variables: { answers } });

      if (data && data.submitAnswers) {
        setResult({
          score: data.submitAnswers.score,
          total: data.submitAnswers.total,
          correctAnswers: data.submitAnswers.correctAnswers || [],
        });

        setCorrectAnswers(data.submitAnswers.correctAnswers || []);
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
    }
  };

  const isSubmitVisible = Object.keys(selectedAnswers).length === 5;

  const getCorrectOption = (questionId: string) => {
    for (const answer of correctAnswers) {
      if (answer.questionId === questionId) {
        return answer.correctOption;
      }
    }
    return undefined;
  };

  if (loading) return <p className="text-center">Loading questions...</p>;
  if (error) return <p className="text-red-500">Error loading questions: {error.message}</p>;
  if (!data || !data.getQuestions) return <p className="text-red-500">No questions found for this selection.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10 text-gray-800">
      {data.getQuestions.map((q: any) => (
        <div key={q.id}>
          <p className="text-lg font-medium mb-4 text-left">{q.text}</p>

          <div className="flex flex-wrap gap-4">
            {q.choices.map((option: string, idx: number) => {
              const selectedOption = selectedAnswers[q.id];
              const correctOption = getCorrectOption(q.id);
              const isSelected = selectedOption === idx;
              const isCorrect = correctOption?.toString() === idx.toString();
              const isWrongSelected = result && isSelected && correctOption !== idx;

              const baseStyle = 'border px-4 py-2 rounded-md transition focus:outline-none';
              let stateStyle = '!border-green-600 !bg-white !text-green-600 hover:!bg-green-50';

              if (result) {
                if (isCorrect) {
                  stateStyle = '!bg-green-600 !text-white !border-green-600 font-semibold';
                } else if (isWrongSelected) {
                  stateStyle = '!bg-red-600 !text-white !border-red-600 font-semibold';
                }
              } else if (isSelected) {
                stateStyle = '!border-green-600 !bg-green-600 !text-white font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(q.id, idx)}
                  className={`${baseStyle} ${stateStyle}`}
                  disabled={!!result}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {isSubmitVisible && !result && (
        <div className="text-center mt-8">
          <PrimaryButton disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Submitting...' : 'Submit'}
          </PrimaryButton>
        </div>
      )}

      {result && (
        <>
          <div className="text-center mt-6 text-lg font-semibold text-white bg-red-600">
            You scored {result.score} out of {result.total}
          </div>
          <div className="text-center mt-4">
            <button onClick={onBack} className="!bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition">
              Create a new quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Question;
