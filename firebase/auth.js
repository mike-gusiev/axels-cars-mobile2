import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { DB, auth } from './firebase';

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  firstName,
  lastName
) => {
  return createUserWithEmailAndPassword(auth, email, password).then(
    async () => {
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(DB, 'Users', user.uid), {
          uid: user.uid,
          email: email,
          firstName: firstName,
          lastName: lastName,
        });
      }
    }
  );
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
  return auth.signOut();
};
