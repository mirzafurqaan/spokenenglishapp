import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {
  useEffect(() => {
    const checkUserData = async () => {
      try {
        // Check if userdata is stored in asyncstorage
        const userData = await AsyncStorage.getItem('userData');
        console.log({userData});
        if (userData) {
          const user = JSON.parse(userData);
          // If user is admin, navigate to Dashboard
          if (user.isAdmin) {
            navigation.replace('Dashboard');
          } else {
            // If user is not admin, navigate to Home
            navigation.replace('Home');
          }
        } else {
          // If userdata is not stored, navigate to Login
          navigation.replace('Login');
        }
      } catch (error) {
        console.error(error);
        // If error occurs, navigate to Login
        navigation.replace('Login');
      }
    };
    checkUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Splash;
