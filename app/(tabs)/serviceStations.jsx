import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import {
  getStoredMarkers,
  isStoredMarkersUpToDate,
  updateStoredMarkers,
} from '../../helpers/storedMarkers';
import { Map } from '../../components';
import useUserLocation from '../../hooks/useUserLocation';
import {
  getMarkers,
  getMarkersFromFirebaseCache,
} from '../../firebase/firestore';

const ServiceStationsPage = () => {
  const { city } = useUserLocation();
  const [serviceStations, setServiceStations] = useState([]);
  const [currentCity, setCurrentCity] = useState(city);

  useEffect(() => {
    if (!city) return;
    setCurrentCity(city);
  }, [city]);

  const onFetchServiceStation = async (city) => {
    if (!city) return;
    try {
      if (await isStoredMarkersUpToDate(city, 'service-stations')) {
        const storedMarkers = await getStoredMarkers(city, 'service-stations');
        setServiceStations(storedMarkers);
        return;
      }

      const markers = await getMarkersFromFirebaseCache(city);
      if (markers) {
        setServiceStations(markers?.['service-stations'] || []);
        updateStoredMarkers(city, 'service-stations', markers['service-stations']);
        return;
      }

      const result = await getMarkers('service-stations', city);
      updateStoredMarkers(city, 'service-stations', result);
      setServiceStations(result);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Не вдалось завантажити сервіси',
        topOffset: 60,
      });
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!currentCity) return;
    getStoredMarkers(currentCity, 'service-stations')
      .then((markers) => {
        if (!markers && markers.length === 0) {
          return;
        }

        setServiceStations(markers);
        onFetchServiceStation(currentCity);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [currentCity]);

  return (
    <Map
      city={currentCity}
      setCity={setCurrentCity}
      markers={serviceStations}
    />
  );
};

export default ServiceStationsPage;
