import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export const UserContext = createContext();

const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user data is already present in AsyncStorage on component mount
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        // Check if user data is already present in Realtime Database on component mount
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userRef = database().ref(`/users/${currentUser.uid}`);
          userRef.once('value', snapshot => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setUser({...currentUser, ...userData});
              // Save updated user data in AsyncStorage
              AsyncStorage.setItem(
                'userData',
                JSON.stringify({...currentUser, ...userData}),
              );
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async phoneNumber => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      const currentUser = confirmation.user;
      const userToken = await currentUser.getIdToken();
      const isAdmin = currentUser.phoneNumber === '<SUPER_USER_PHONE_NUMBER>'; // Replace with the super user/admin phone number
      const userRef = database().ref(`/users/${currentUser.uid}`);
      userRef.update({
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        isAdmin: isAdmin,
      });
      setUser({...currentUser, isAdmin});

      // Save user data in AsyncStorage
      const userData = {
        uid: currentUser.uid,
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        isAdmin: isAdmin,
        name: decodedToken.name || '',
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: user,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
