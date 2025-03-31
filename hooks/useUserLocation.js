import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

import { transliterate } from '../helpers/transliterate';
// import Toast from 'react-native-toast-message';
import { getCitiesFromFirebaseCache } from '../firebase/firestore';
import { DEFAULT_LOCATION } from '../constants/locations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStoredCity, isStoredCityUpToDate } from '../helpers/storedCity';

const useUserLocation = () => {
  const [city, setCity] = useState(undefined);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [citiesList, setCitiesList] = useState(null);

  useEffect(() => {
    const getCitiesList = async () => {
      try {
         const { cities, updatedAt } = await getCitiesFromFirebaseCache();

        await AsyncStorage.setItem(
          'cities',
          JSON.stringify({
            cities: cities,
            updatedAt: updatedAt,
          })
        );

        setCitiesList(cities);
      } catch (error) {
        console.error(error.message);
      }
    };

    const checkAndLoadCities = async () => {
      if (await isStoredCityUpToDate()) {
        const { cities } = await getStoredCity();

        if (cities) {
          setCitiesList(cities);
        }

        return;
      }

      getCitiesList();
    };

    checkAndLoadCities();
  }, [setCitiesList]);

  useEffect(() => {
    if (city || !citiesList) return;
    const getLocationAndCity = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        // const status = 'granted'
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          console.error('error', status);
          return;
        }

        let locationData = await Location.getCurrentPositionAsync({});
        const location = {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        };

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': 'uk',
              'User-Agent': 'axels-car',
            },
          }
        );

        if (!response.ok) {
          console.error(`Помилка: ${response.status} ${response.statusText}`);
          return;
        }

        const userLocation = await response.json();
        const transliteratedUserCity = transliterate(
          userLocation.address.city ||
            userLocation.address.town ||
            userLocation.address.village ||
            userLocation.address.hamlet
        );
        const cityExists = citiesList.some(
          (city) => city.name === transliteratedUserCity
        );

        if (cityExists) {
          setCity(transliteratedUserCity);
          setUserLocation({
            position: {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: location.latitudeDelta,
              longitudeDelta: location.longitudeDelta,
            },
            name: transliteratedUserCity,
          });
        } else {
          setCity(DEFAULT_LOCATION.name);
          setUserLocation({
            position: {
              latitude: DEFAULT_LOCATION.latitude,
              longitude: DEFAULT_LOCATION.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            },
          });
          setErrorMsg('Місто відсутнє у списку');
          // Toast.show({
          //   type: 'error',
          //   text1: 'Ваше місто відсутнє у списку',
          //   topOffset: 60,
          // });
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMsg(error.message);
        setCity(DEFAULT_LOCATION.name);
        setUserLocation({
          position: {
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          },
        });
        // Toast.show({
        //   type: 'error',
        //   text1: 'Не вдалось визначити ваше місцезнаходження',
        //   topOffset: 60,
        // });
      }
    };
    getLocationAndCity();
  }, [citiesList, city]);

  return { city, userLocation, errorMsg, setCity, setUserLocation, citiesList };
};

export default useUserLocation;
