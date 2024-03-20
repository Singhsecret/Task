// pages/index.tsx

import { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Draw, Modify, Snap } from 'ol/interaction';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    if (!map) {
      const initialMap = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]),
          zoom: 2,
        }),
        target: mapContainer.current!,
      });

      setMap(initialMap);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      const drawSource = new VectorSource();
      const drawLayer = new VectorLayer({
        source: drawSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2,
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33',
            }),
          }),
        }),
      });

      map.addLayer(drawLayer);

      const drawInteraction = new Draw({
        source: drawSource,
        type: 'Point', // Change to 'Polygon' or 'LineString' for other draw types
      });

      map.addInteraction(drawInteraction);

      const modifyInteraction = new Modify({ source: drawSource });
      map.addInteraction(modifyInteraction);

      const snapInteraction = new Snap({ source: drawSource });
      map.addInteraction(snapInteraction);

      return () => {
        map.removeLayer(drawLayer);
        map.removeInteraction(drawInteraction);
        map.removeInteraction(modifyInteraction);
        map.removeInteraction(snapInteraction);
      };
    }
  }, [map]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '500px' }}>
      Map Container
    </div>
  );
};

export default MapPage;
