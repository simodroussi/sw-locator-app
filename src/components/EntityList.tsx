import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getDistance } from 'geolib';
import EntityCard from './EntityCard';
import { setUserLocation } from '../store/slices/userSlice';
import styles from './styles.module.css';

export const EntityList = () => {
  const entities = useAppSelector((state) => state.entities.entities);
  const dispatch = useAppDispatch();
  const { lat, long } = useAppSelector((state) => state.user);

  const distanceToEntities = useMemo(() => {
    if (lat && long) {
      return entities
        .map((entity) => {
          const distance = getDistance(
            { latitude: entity.lat, longitude: long },
            { latitude: lat, longitude: entity.long }
          );
          return { ...entity, distance: distance / 1000 };
        })
        .sort((a, b) => a.distance - b.distance);
    }
    return [];
  }, [entities, lat, long]);

  if (!lat || !long) {
    return <div>Please click on the map to set your location.</div>;
  }

  const handleClose = () => {
    dispatch(setUserLocation({ latitude: null, longitude: null }));
  };

  return (
    <div className={styles.entityListContainer}>
      <button className={styles.closeButton} onClick={handleClose}>
        X
      </button>
      <div className={styles.entityList}>
        {distanceToEntities.map((entity) => (
          <EntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
};
