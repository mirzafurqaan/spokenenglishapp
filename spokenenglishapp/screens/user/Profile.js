import React, {useContext} from 'react';
import {View, Text, Button} from 'react-native';
import {UserContext} from './UserContext';
import auth from '@react-native-firebase/auth';

const Profile = () => {
  const {user, handleLogout} = useContext(UserContext);
  const handleLogout = async () => {
    try {
      // Sign out user from Firebase
      await FirebaseAuthTypes().signOut();
      // Remove user data from AsyncStorage
      await AsyncStorage.removeItem('userData');
      // Clear user state
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      {user ? (
        <>
          <Text>Logged in as: {user.phoneNumber}</Text>
          {/* Render other user profile data */}
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>User not logged in.</Text>
      )}
    </View>
  );
};

export default Profile;
