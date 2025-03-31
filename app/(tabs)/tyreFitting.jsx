import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

import {
  getStoredMarkers,
  isStoredMarkersUpToDate,
  updateStoredMarkers,
} from '../../helpers/storedMarkers';
import { Map } from '../../components';
import useUserLocation from '../../hooks/useUserLocation';
import { getMarkers, getMarkersFromFirebaseCache } from '../../firebase/firestore';


const TyreFittingPage = () => {
  const { city } = useUserLocation();

  const [tyreFitting, setTyreFitting] = useState([]);
  const [currentCity, setCurrentCity] = useState(city);

  useEffect(() => {
    if (!city) return;
    setCurrentCity(city);
  }, [city]);

  const onFetchTyreFitting = async (city) => {
    if (!city) return;

    try {
      if (await isStoredMarkersUpToDate(city, 'tyre-fitting')) {
        const storedMarkers = await getStoredMarkers(city, 'tyre-fitting');
        setTyreFitting(storedMarkers);
        return;
      }

      const markers = await getMarkersFromFirebaseCache(city);
      if (markers) {
        setTyreFitting(markers?.['tyre-fitting'] || []);
        updateStoredMarkers(city, 'tyre-fitting', markers['tyre-fitting']);
        return;
      }

      const result = await getMarkers('tyre-fitting', city);
      updateStoredMarkers(city, 'tyre-fitting', result);
      setTyreFitting(result);
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
    getStoredMarkers(currentCity, 'tyre-fitting')
      .then((markers) => {
        if (!markers && markers.length === 0) {
          return;
        }
        setTyreFitting(markers);
        onFetchTyreFitting(currentCity);
      })
      .catch((error) => console.error(error.message));
  }, [currentCity]);
  return (
    <Map city={currentCity} setCity={setCurrentCity} markers={tyreFitting} />
  );
};

export default TyreFittingPage;
