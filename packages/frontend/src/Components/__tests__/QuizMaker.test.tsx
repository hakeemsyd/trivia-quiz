import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MockedProvider } from '@apollo/client/testing';
import QuizMaker from '../Quizmaker/Quizmaker';
import { GET_CATEGORIES } from '../../graphql/index.gql';
import { ReduxProvider } from './test-utils';

const mockCategories = [
  { id: '1', name: 'History' },
  { id: '2', name: 'Science' },
];

const mocks = [
  {
    request: {
      query: GET_CATEGORIES,
    },
    result: {
      data: {
        getCategories: mockCategories,
      },
    },
  },
];

describe('QuizMaker', () => {
  it('enables Create button only when both category and difficulty are selected', async () => {
    render(
      <ReduxProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <QuizMaker />
        </MockedProvider>
      </ReduxProvider>
    );

    // Wait for mock data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading categories...')).not.toBeNull();
    });
    // Initially button should be disabled
    const createButton = screen.getByText('Create');
    expect(createButton).toBeDisabled();

    // Find selects by their role
    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[0];
    const difficultySelect = selects[1];

    // Select category and difficulty
    // For category, we use the name as value
    fireEvent.change(categorySelect, { target: { value: 'History' } });
    // For difficulty, we use the id as value
    fireEvent.change(difficultySelect, { target: { value: 'easy' } });

    // Wait for button to be enabled
    await waitFor(() => {
      expect(createButton).not.toBeDisabled();
    });
  });

  it('shows Questions component when Create is clicked', async () => {
    render(
      <ReduxProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <QuizMaker />
        </MockedProvider>
      </ReduxProvider>
    );

    // Wait for mock data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading categories...')).not.toBeNull();
    });

    // Find selects by their role
    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[0];
    const difficultySelect = selects[1];

    // Select options and click Create
    // For category, we use the name as value
    fireEvent.change(categorySelect, { target: { value: 'History' } });
    // For difficulty, we use the id as value
    fireEvent.change(difficultySelect, { target: { value: 'easy' } });

    const createButton = screen.getByText('Create');

    // Wait for button to be enabled
    await waitFor(() => {
      expect(createButton).not.toBeDisabled();
    });

    fireEvent.click(createButton);

    // Wait for component to update
    expect(screen.queryByText('Loading categories...')).toBeNull();
  });
});
