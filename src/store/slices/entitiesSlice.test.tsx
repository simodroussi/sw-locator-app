import reducer, { fetchEntities, EntitiesState, decryptSecret } from './entitiesSlice';
import axios from 'axios';
import configureStore from 'redux-mock-store';

const mockStore = configureStore<EntitiesState>();
jest.mock('axios');

describe('entitiesSlice', () => {
  const initialState: EntitiesState = {
    entities: [],
    status: 'idle',
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchAndEntities', () => {
    it('should handle fetch and decryption of entities', async () => {
      const encryptedData = [{ id: 7, lat: 43.0, long: -79.0 }];
      const decryptedData = [{ id: 4, lat: 40.0, long: -82.0 }];
      const entityDetails = [{ id: 4, name: 'Darth Vader', image: 'vader.jpg', lat: 40.0, long: -82.0 }];

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: encryptedData });

      (decryptSecret as jest.Mock) = jest.fn(() => decryptedData);

      const store = mockStore(initialState);

      const fulfilledAction = fetchEntities.fulfilled(entityDetails, 'test-request-id', undefined);
      store.dispatch(fulfilledAction);

      const actions = store.getActions();
      expect(actions[0].type).toEqual(fetchEntities.fulfilled.type);
      expect(actions[0].payload).toEqual(entityDetails);

      (decryptSecret as jest.Mock).mockReset();
    });

    it('should handle fetch errors', async () => {
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      const store = mockStore(initialState);

      store.dispatch({
        type: fetchEntities.rejected.type,
        payload: 'Failed to fetch and decrypt entities.',
      });

      const actions = store.getActions();

      expect(actions[0].type).toEqual(fetchEntities.rejected.type);
      expect(actions[0].payload).toEqual('Failed to fetch and decrypt entities.');
    });
  });
});
