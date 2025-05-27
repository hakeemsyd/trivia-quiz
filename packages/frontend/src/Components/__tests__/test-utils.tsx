// src/Components/__tests__/test-utils.tsx
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import triviaReducer from '../../store/slices/triviaSlice';

export const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const store = configureStore({
    reducer: {
      trivia: triviaReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

  return <Provider store={store}>{children}</Provider>;
};
