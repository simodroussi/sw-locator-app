import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Base64 } from 'js-base64';

interface EntityLocation {
  id: number;
  lat: number;
  long: number;
}

export interface Entity extends EntityLocation {
  name: string;
  height: number;
  mass: number;
  gender: string;
  homeworld: string;
  wiki: string;
  image: string;
}

export interface EntitiesState {
  entities: Entity[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EntitiesState = {
  entities: [],
  status: 'idle',
  error: null,
};

export const decryptSecret = (message: string): EntityLocation[] => {
  const secret: EntityLocation[] = JSON.parse(Base64.decode(message));
  return secret;
};

export const fetchEntities = createAsyncThunk('entities/fetchEntities', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(process.env.REACT_APP_SECRET_API_URL ?? '');
    const encryptedData = response.data.message;
    const decryptedData = decryptSecret(encryptedData);
    const entitiesList = await Promise.all(
      decryptedData.map(async (entity) => {
        try {
          const entityResponse = await axios.get(`${process.env.REACT_APP_ENTITY_API_URL ?? ''}${entity.id}.json`);
          return { ...entity, ...entityResponse.data };
        } catch (err) {
          console.error(`Failed to fetch entity ${entity.id}:`, err);
          return null;
        }
      })
    );
    return entitiesList;
  } catch (err) {
    return rejectWithValue('Failed to fetch and decrypt entities.');
  }
});

const entitiesSlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default entitiesSlice.reducer;
