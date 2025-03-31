import { getDistance } from 'geolib';

const calculateDistance = (userCoords, markerCoords) => {
  return getDistance(
    { latitude: userCoords[0], longitude: userCoords[1] },
    { latitude: markerCoords[0], longitude: markerCoords[1] }
  );
};

export const sortByDistance = (data, userCoords) => {
  const sortedData = data
    .map((item) => {
      return {
        ...item,
        distance: calculateDistance(
          [userCoords.latitude, userCoords.longitude],
          [item?.latitude, item?.longitude]
        ),
      };
    })
    .sort((a, b) => a.distance - b.distance);

  return sortedData;
};
