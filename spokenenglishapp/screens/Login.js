import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedInUser = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userRef = database().ref(`/users/${currentUser.uid}`);
        userRef.once('value', snapshot => {
          const userData = snapshot.val();
          setUser({...currentUser, ...userData});
          navigateToScreen(userData.isAdmin);
        });
      }
    };
    checkLoggedInUser();
  }, []);

  const handleSendCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmation(confirmation);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await confirmation.confirm(verificationCode);
      const currentUser = auth().currentUser;
      const userRef = database().ref(`/users/${currentUser.uid}`);
      const isAdmin = currentUser.phoneNumber === '+919727692148'; // Replace with the super user/admin phone number
      userRef.set({
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        isAdmin: isAdmin,
      });

      // Store user data in AsyncStorage
      const userData = {
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        isAdmin: isAdmin,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(currentUser);
      navigateToScreen(isAdmin);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      // await confirmation.confirm(verificationCode);
      // const currentUser = auth().currentUser;

      // const userRef = database().ref(`/users/${currentUser.uid}`);
      const isAdmin = phoneNumber === '+919727692148'; // Replace with the super user/admin phone number
      // userRef.set({
      //   phoneNumber: phoneNumber,
      //   isAdmin: isAdmin,
      // });

      // Store user data in AsyncStorage
      const userData = {
        phoneNumber: phoneNumber,
        isAdmin: isAdmin,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      navigateToScreen(isAdmin);
    } catch (error) {
      console.error(error);
    }
  };
  const navigateToScreen = isAdmin => {
    if (isAdmin) {
      navigation.navigate('Dashboard'); // Navigate to Dashboard screen for admin
    } else {
      navigation.navigate('Home'); // Navigate to Home screen for regular user
    }
  };

  return (
    <View style={styles.container}>
      {!user && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {confirmation ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <Button title="Verify Code" onPress={handleVerifyCode} />
            </>
          ) : (
            <Button title="Login" onPress={handleLogin} />
            // <Button title="Send Code" onPress={handleSendCode} />
          )}
        </>
      )}
      {user && (
        <View>
          <Text>Logged in as: {user.phoneNumber}</Text>
          <Text>Admin: {user.isAdmin ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderColor: 'gray',
    borderWidth: 1,
  },
});

export default Login;
