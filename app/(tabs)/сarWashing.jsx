import React, { useEffect, useState } from "react";
// import Toast from 'react-native-toast-message';

import {
  getStoredMarkers,
  isStoredMarkersUpToDate,
  updateStoredMarkers,
} from "../../helpers/storedMarkers";
import { Map } from "../../components";
import useUserLocation from "../../hooks/useUserLocation";
import {
  getMarkers,
  getMarkersFromFirebaseCache,
} from "../../firebase/firestore";

const CarWashingPage = () => {
  const { city } = useUserLocation();

  const [carWashing, setCarWashing] = useState([]);
  const [currentCity, setCurrentCity] = useState(city);

  useEffect(() => {
    if (!city) return;
    setCurrentCity(city);
  }, [city]);

  const onFetchCarWashing = async (city) => {
    if (!city) return;

    try {
      if (await isStoredMarkersUpToDate(city, "car-washing")) {
        const storedMarkers = await getStoredMarkers(city, "car-washing");
        setCarWashing(storedMarkers);
        return;
      }

      const markers = await getMarkersFromFirebaseCache(city);
      if (markers) {
        setCarWashing(markers?.["car-washing"] || []);
        updateStoredMarkers(city, "car-washing", markers["car-washing"]);
        return;
      }

      const result = await getMarkers("car-washing", city);
      updateStoredMarkers(city, "car-washing", result);
      setCarWashing(result);
    } catch (error) {
      // Toast.show({
      //   type: "error",
      //   text1: "Не вдалось завантажити сервіси",
      //   topOffset: 60,
      // });
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (!currentCity) return;
    getStoredMarkers(currentCity, "car-washing")
      .then((markers) => {
        if (!markers && markers.length === 0) {
          return;
        }
        setCarWashing(markers);
        onFetchCarWashing(currentCity);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [currentCity]);

  return (
    <Map city={currentCity} setCity={setCurrentCity} markers={carWashing} />
  );
};

export default CarWashingPage;
