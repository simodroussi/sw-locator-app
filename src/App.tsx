import { useEffect } from 'react';
import LocationsMap from './components/LocationsMap';
import { useAppDispatch } from './hooks';
import { fetchEntities } from './store/slices/entitiesSlice';
import { EntityList } from './components/EntityList';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEntities());
  }, [dispatch]);

  return (
    <div className='app-container'>
      <h1 className='title'>Star Wars Locator</h1>
      <div className='locations-map'>
        <LocationsMap />
        <EntityList />
      </div>
    </div>
  );
}

export default App;
