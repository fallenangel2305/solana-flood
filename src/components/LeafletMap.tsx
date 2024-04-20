// components/LeafletMap.tsx

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
const LeafletMap = () => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      const L = await import('leaflet');

      if (!mapRef.current) {
        mapRef.current = L.map('map', {
          center: [0, 0], // Initial center coordinates
          zoom: 2, // Initial zoom level
          worldCopyJump: true
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 18,
          noWrap: true
        }).addTo(mapRef.current);
      }

      // Fetch flood data
      const API_URL = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/MAP?eventtypes=FL';
      fetch(API_URL)
        .then(response => response.json())
        .then(data => {
          data.features.forEach(feature => {
            if (feature.geometry.type === 'Point') {
              const coordinates = feature.geometry.coordinates;
              const latLng = L.latLng(coordinates[1], coordinates[0]);
              const popupContent = `
                <b>${feature.properties.name}</b><br>
                <p>${feature.properties.description}</p>
                <p><b>Alert Level:</b> ${feature.properties.alertlevel}</p>
                <p><b>Affected Countries:</b> ${feature.properties.affectedcountries.map(country => country.countryname).join(', ')}</p>
                <p><a href="${feature.properties.url.report}" target="_blank">Report</a></p>
              `;
              L.marker(latLng).addTo(mapRef.current!).bindPopup(popupContent);
            }
          });
        })
        .catch(error => {
          console.error('Error fetching flood data:', error);
        });
    };

    if (typeof window !== 'undefined') {
      loadMap();
    }
  }, []);

  return <div id="map" style={{ height: '600px', width: '100%' }}></div>;
};

export default LeafletMap;
