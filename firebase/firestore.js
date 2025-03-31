import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
// import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
// import Toast from 'react-native-toast-message';
import { updateProfile } from 'firebase/auth';

import { DB, storage, auth } from './firebase';
import { getDownloadURL, getMetadata, ref, uploadBytes } from 'firebase/storage';

// Users

const updateUserCars = async (userId, updateObj) => {
  try {
    const userRef = doc(DB, 'Users', userId);

    await updateDoc(userRef, updateObj);
    const userDoc = await getDoc(userRef);

    return userDoc?.data()?.cars ?? [];
  } catch (error) {
    throw new Error(`Error updating user cars: ${error.message}`);
  }
};

export const addCarToUser = async (userId, carData) => {
  try {
    const carWithId = { ...carData, id: uuidv4() };

    return await updateUserCars(userId, {
      cars: arrayUnion(carWithId),
    });
  } catch (error) {
    throw new Error(`Error adding car to user: ${error.message}`);
  }
};

export const deleteCarFromUser = async (userId, car) => {
  try {
    return await updateUserCars(userId, {
      cars: arrayRemove(car),
    });
  } catch (error) {
    throw new Error(`Error deleting car from user: ${error.message}`);
  }
};

export const getUserById = async (userId) => {
  try {
    const userRef = doc(DB, 'Users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('Користувача не знайдено.');
    }
  } catch (error) {
    throw new Error(
      `Помилка при отриманні даних користувача: ${error.message}`
    );
  }
};

export const updateUser = async (userId, updateObj) => {
  try {
    const userRef = doc(DB, 'Users', userId);
    const userDoc = await getDoc(userRef);
    const user = userDoc.data();

    await updateProfile(auth.currentUser, updateObj);
    await updateDoc(userRef, { ...user, ...updateObj });
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const getUserCars = async (userId) => {
  try {
    return await updateUserCars(userId, {});
  } catch (error) {
    throw new Error(`Error getting user cars: ${error.message}`);
  }
};

// Bookings

export const addUserBooking = async (updateObj) => {
  try {
    // Toast.show({
    //   type: 'success',
    //   text1: 'Ваше бронювання успішне!',
    //   text2: "Менеджер скоро зв'яжеться з вами.",
    //   topOffset: 60,
    // });
    await setDoc(doc(DB, 'Bookings', uuidv4()), updateObj);
  } catch (error) {
    throw new Error(`Error updating user bookings: ${error.message}`);
  }
};

export const getUserBookings = async (uid, status) => {
  if (!uid || !status) {
    console.error('User or status is missing');
    return [];
  }

  const user = await getUserById(uid);

  const userData = {
    displayName: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
    role: user.role,
    uid: user.uid,
  };

  try {
    const bookingsRef = collection(DB, 'Bookings');

    const q = query(
      bookingsRef,
      where('uid', '==', uid),
      where('status', '==', status)
    );

    const querySnapshot = await getDocs(q);

    const bookings = [];

    await Promise.all(
      querySnapshot.docs.map(async (document) => {
        const companyId = document.data().company?.id;
        if (!companyId) {
          console.error(`Company ID is missing for document ID: ${document.id}`);
          return;
        }

        const docRef = doc(DB, 'Markers', companyId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          bookings.push({
            ...document.data(),
            company: {...docSnap.data(), id: companyId},
            user: userData,
            id: document.id,
          });
        } else {
          console.error(`No document found for company ID: ${companyId}`);
        }
      })
    );

    return bookings;
  } catch (error) {
    console.error(`Error getting user bookings: ${error.message}`);
    return [];
  }
};

export const removeBooking = async (id) => {
  try {
    const bookingRef = doc(DB, 'Bookings', id);

    await deleteDoc(bookingRef);

    // Toast.show({
    //   type: 'success',
    //   text1: 'Ваше бронювання було успішно видалене!',
    //   topOffset: 60,
    // });
  } catch (error) {
    console.error('Error removing booking: ', error);
  }
};

export const removeAllCompletedBookings = async (uid) => {
  try {
    const bookingsRef = collection(DB, 'Bookings');
    const q = query(
      bookingsRef,
      where('status', '==', 'done'),
      where('uid', '==', uid)
    );
    const querySnapshot = await getDocs(q);

    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);

    // Toast.show({
    //   type: 'success',
    //   text1: 'Ваші бронювання були успішно видалені!',
    //   topOffset: 60,
    // });
  } catch (error) {
    console.error('Error removing completed bookings: ', error);
  }
};

export const editBooking = async (id, description) => {
  try {
    const bookingRef = doc(DB, 'Bookings', id);
    await updateDoc(bookingRef, { description });
    // Toast.show({
    //   type: 'success',
    //   text1: 'Ваше бронювання було успішно оновлено!',
    //   topOffset: 60,
    // });
  } catch (error) {
    console.error('Error updating description: ', error);
  }
};

// Markers

export const getMarkers = async (type, city) => {
  try {
    const q = query(
      collection(DB, 'Markers'),
      where('type', '==', type),
      where('city', '==', city)
    );

    const querySnapshot = await getDocs(q);

    const data = [];

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error(`Error getting markers: ${error.message}`);
    // Toast.show({
    //   type: 'error',
    //   text1: error.message,
    //   topOffset: 60,
    // });
    return [];
  }
};

export const getMarkersFromFirebaseCache = async (city) => {
  try {
    const cityRef = ref(storage, `cache/markers/${city}.json`);
    const url = await getDownloadURL(cityRef);
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    console.error(`Error getting markers from cache: ${e.message}`);
    return [];
  }
};

// Cities

export const getCities = async () => {
  try {
    const querySnapshot = await getDocs(query(collection(DB, 'Cities')));
    const data = [];
    querySnapshot?.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error(`Error getting cities: ${error.message}`);
    return [];
  }
};

export const getCitiesFromFirebaseCache = async () => {
  try {
    const cityRef = ref(storage, `cache/cities/list.json`);
    const url = await getDownloadURL(cityRef);
    const metadata = await getMetadata(cityRef);
    const response = await fetch(url);
    const parsedResponse = await response.json();

    const data = {
      updatedAt: metadata.updated,
      cities: parsedResponse.cities,
    };

    return data;
  } catch (e) {
    console.error('Cache error:', e);

    if (e.code === 'storage/object-not-found') {
      console.warn('Cache file for cities does not exist, creating a new one.');

      try {
        const cities = await getCities();

        const payload = {
          cities,
        };

        const blob = new Blob([JSON.stringify(payload)], {
          type: 'application/json',
        });
        const storageRef = ref(storage, `cache/cities/list.json`);

        await uploadBytes(storageRef, blob)
          .then(() => {
            // Toast.show({
            //   type: 'success',
            //   text1: 'Кеш створено',
            //   topOffset: 60,
            // });
          })
          .catch((e) => {
            console.error('Не вдалось створити кеш', e);
          });

        const metadata = await getMetadata(storageRef);

        const data = {
          updatedAt: metadata.updated,
          cities,
        };

        return data;
      } catch (error) {
        console.error('Error getting cities from Firebase Database');
        return [];
      }
    }
    return [];
  }
};