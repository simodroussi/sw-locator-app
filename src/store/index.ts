import { configureStore } from '@reduxjs/toolkit';
import entitiesReducer from './slices/entitiesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({ reducer: { entities: entitiesReducer, user: userReducer } });
