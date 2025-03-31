import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStoredMarkers = async (city, type) => {
  const localStorageData = await AsyncStorage.getItem(city);
  const parsedData = JSON.parse(localStorageData);
  return parsedData?.[type]?.data || [];
};

export const isStoredMarkersUpToDate = async (city, type) => {
  const localStorageData = await AsyncStorage.getItem(city);
  const parsedData = JSON.parse(localStorageData);
  if (parsedData?.[type]) {
    const updatedAt = parsedData[type]?.updatedAt;
    if (
      Math.round(
        (new Date().getTime() - new Date(updatedAt).getTime()) /
          (1000 * 3600 * 24)
      ) < 30
    )
      return true; // 30 days
  }
  return false;
};

export const updateStoredMarkers = async (city, type, data) => {
  const localStorageData = await AsyncStorage.getItem(city);
  const parsedData = JSON.parse(localStorageData);
  await AsyncStorage.setItem(
    city,
    JSON.stringify({
      ...parsedData,
      [type]: { updatedAt: new Date().toLocaleDateString('en-US'), data },
    })
  );
};
