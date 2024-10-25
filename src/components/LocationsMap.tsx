import Map, { Layer, Marker, Popup, Source } from 'react-map-gl';
import { useAppDispatch, useAppSelector } from '../hooks';
import 'mapbox-gl/dist/mapbox-gl.css';
import { setUserLocation } from '../store/slices/userSlice';
import { Spinner } from './Spinner';
import styles from './styles.module.css';
import Pin from './Pin';
import { useMemo, useState } from 'react';
import { Entity } from '../store/slices/entitiesSlice';

const LocationsMap = () => {
  const { entities, status, error } = useAppSelector((state) => state.entities);
  const [hoveredEntity, setHoveredEntity] = useState<Entity | null>(null);
  const { lat, long } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.lngLat;
    dispatch(setUserLocation({ latitude: lat, longitude: lng }));
  };

  const linesToEntities = useMemo(() => {
    if (lat && long) {
      return {
        type: 'FeatureCollection',
        features: entities.map((entity) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [long, lat],
              [entity.long, entity.lat],
            ],
          },
          properties: {},
        })),
      };
    }
    return { type: 'FeatureCollection', features: [] };
  }, [entities, lat, long]);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (status === 'failed') {
    return <div>Error loading map data: {error}</div>;
  }

  return (
    <>
      <Map
        initialViewState={{
          latitude: 0,
          longitude: 0,
          zoom: 2,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle='mapbox://styles/mapbox/dark-v10'
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onClick={handleMapClick}
        maxBounds={[
          [-180, -85],
          [180, 85],
        ]}
        minZoom={1.5}
        maxZoom={16}
      >
        {lat && long && (
          <Source id='polylineLayer' type='geojson' data={linesToEntities}>
            <Layer
              id='lineLayer'
              type='line'
              source='my-data'
              layout={{
                'line-join': 'round',
                'line-cap': 'round',
              }}
              paint={{
                'line-color': 'rgba(3, 170, 238, 0.5)',
                'line-width': 5,
              }}
            />
          </Source>
        )}
        {entities.map((entity) => (
          <div
            key={entity.id}
            onMouseEnter={() => setHoveredEntity(entity)}
            onMouseLeave={() => setHoveredEntity(null)}
          >
            <Marker longitude={entity.long} latitude={entity.lat} anchor='bottom'>
              <Pin
                style={{
                  cursor: 'pointer',
                  fill: '#ffe81f',
                  stroke: 'none',
                }}
              />
            </Marker>
          </div>
        ))}
        {hoveredEntity && (
          <Popup
            closeButton={false}
            anchor='top'
            longitude={hoveredEntity.long}
            latitude={hoveredEntity.lat}
            onClose={() => setHoveredEntity(null)}
          >
            <h5>
              {hoveredEntity.name}, {hoveredEntity.homeworld}
            </h5>
            <img src={hoveredEntity.image} className={styles.entityImage} />
          </Popup>
        )}
        {lat && long && (
          <Marker latitude={lat} longitude={long}>
            <Pin
              style={{
                cursor: 'pointer',
                fill: '#2e557c',
                stroke: 'none',
              }}
            />
          </Marker>
        )}
      </Map>
    </>
  );
};

export default LocationsMap;
