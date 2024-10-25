import { Entity } from './../store/slices/entitiesSlice';
import styles from './styles.module.css';

interface EntityWithDistance extends Entity {
  distance: number;
}

type EntityCardProps = {
  entity: EntityWithDistance;
};

const EntityCard = ({ entity }: EntityCardProps) => {
  const { image, name, distance, homeworld } = entity;

  return (
    <div className={styles.entityCard}>
      <img src={image} alt={name} className={styles.entityCardImage} />
      <div className={styles.entityCardInfo}>
        <h3>{name}</h3>
        <p>
          <span>Distance:</span> {distance} km
        </p>
        <p>
          <span>Homeworld:</span> {homeworld}
        </p>
      </div>
    </div>
  );
};

export default EntityCard;
