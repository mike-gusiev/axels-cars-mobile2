import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMetadata, ref } from 'firebase/storage';
import { storage } from '../firebase/firebase';

export const getStoredCity = async () => {
  const localStorageData = await AsyncStorage.getItem('cities');
  const parsedData = JSON.parse(localStorageData);
  return parsedData || [];
};

export const isStoredCityUpToDate = async () => {
  const localStorageData = await AsyncStorage.getItem('cities');
  const parsedData = JSON.parse(localStorageData);
  
  const cityRef = ref(storage, `cache/cities/list.json`);
  const metadata = await getMetadata(cityRef);

  if (parsedData?.updatedAt === metadata.updated) {
    return true;
  }
  return false;
};
