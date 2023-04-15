import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const Login = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [user, setUser] = useState(null);

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
      const isAdmin = currentUser.phoneNumber === '<SUPER_USER_PHONE_NUMBER>'; // Replace with the super user/admin phone number
      userRef.set({
        phoneNumber: currentUser.phoneNumber,
        email: currentUser.email,
        isAdmin: isAdmin, // Add a field to identify if the user is an admin or a regular user
        // Add any other user details you want to store
      });
      setUser(currentUser);
    } catch (error) {
      console.error(error);
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
            <Button title="Send Code" onPress={handleSendCode} />
          )}
        </>
      )}
      {user && (
        <View>
          <Text>Logged in as: {user.phoneNumber}</Text>
          {/* Display other user details from Realtime Database here */}
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
