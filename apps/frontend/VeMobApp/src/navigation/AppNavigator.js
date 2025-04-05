import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import PhoneVerificationScreen from '../screens/PhoneVerificationScreen';
import ClaimRewardsScreen from '../screens/ClaimRewardsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            title: 'VeMob',
            headerShown: false 
          }} 
        />
        
        <Stack.Screen 
          name="PhoneVerification" 
          component={PhoneVerificationScreen} 
          options={{ 
            title: 'Vérification',
            headerBackTitle: 'Retour'
          }} 
        />
        
        <Stack.Screen 
          name="ClaimRewards" 
          component={ClaimRewardsScreen} 
          options={{ 
            title: 'Mes récompenses',
            headerBackVisible: false
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 