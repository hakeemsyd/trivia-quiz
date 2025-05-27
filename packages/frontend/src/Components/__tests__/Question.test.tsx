import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { describe, it, expect, vi } from 'vitest';
import Question from '../Question/Question';
import { GET_QUESTIONS, SUBMIT_ANSWERS } from '../../graphql/index.gql';
import { ReduxProvider } from './test-utils';

const mockQuestions = {
  getQuestions: [
    {
      id: '1',
      text: 'Sample question 1?',
      category: 'History',
      difficulty: 'medium',
      choices: ['Option A', 'Option B', 'Option C', 'Option D'],
    },
    {
      id: '2',
      text: 'Sample question 2?',
      category: 'History',
      difficulty: 'medium',
      choices: ['Option W', 'Option X', 'Option Y', 'Option Z'],
    },
    {
      id: '3',
      text: 'Sample question 3?',
      category: 'History',
      difficulty: 'medium',
      choices: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    },
    {
      id: '4',
      text: 'Sample question 4?',
      category: 'History',
      difficulty: 'medium',
      choices: ['Option 5', 'Option 6', 'Option 7', 'Option 8'],
    },
    {
      id: '5',
      text: 'Sample question 5?',
      category: 'History',
      difficulty: 'medium',
      choices: ['Option 9', 'Option 10', 'Option 11', 'Option 12'],
    },
  ],
};

const mocks = [
  {
    request: {
      query: GET_QUESTIONS,
      variables: { category: 'History', difficulty: 'medium' },
    },
    result: { data: mockQuestions },
  },
  {
    request: {
      query: SUBMIT_ANSWERS,
      variables: {
        answers: [
          { questionId: '1', selectedOption: 0 },
          { questionId: '2', selectedOption: 1 },
          { questionId: '3', selectedOption: 0 },
          { questionId: '4', selectedOption: 0 },
          { questionId: '5', selectedOption: 0 },
        ],
      },
    },
    result: {
      data: {
        submitAnswers: {
          score: 1,
          total: 5,
          correctAnswers: [
            { questionId: '1', correctOption: 0 },
            { questionId: '2', correctOption: 2 },
            { questionId: '3', correctOption: 1 },
            { questionId: '4', correctOption: 3 },
            { questionId: '5', correctOption: 2 },
          ],
        },
      },
    },
  },
];

describe('Question Component', () => {
  const mockOnBack = vi.fn();
  const defaultProps = {
    category: 'History',
    difficulty: 'medium',
    onBack: mockOnBack,
  };

  it('displays score and back button after submission', async () => {
    render(
      <ReduxProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Question {...defaultProps} />
        </MockedProvider>
      </ReduxProvider>
    );

    // Wait for questions to appear
    await screen.findByText('Sample question 1?');

    // Select all 5 answers
    fireEvent.click(screen.getByText('Option A'));
    fireEvent.click(screen.getByText('Option X'));
    fireEvent.click(screen.getByText('Option 1'));
    fireEvent.click(screen.getByText('Option 5'));
    fireEvent.click(screen.getByText('Option 9'));

    // Click submit and wait for the mutation to complete
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the score to appear
    await screen.findByText('You scored 1 out of 5');

    // Verify the "Create a new quiz" button appears and works
    const newQuizButton = screen.getByText('Create a new quiz');
    expect(newQuizButton).toBeInTheDocument();

    fireEvent.click(newQuizButton);
    expect(mockOnBack).toHaveBeenCalled();
  });
});
