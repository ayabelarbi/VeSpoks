import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

export default function PhoneVerificationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    // Simuler l'envoi de code
    setIsCodeSent(true);
    setError('');
    // Dans un cas réel, vous enverriez ici une requête API pour envoyer un SMS
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length < 4) {
      setError('Veuillez entrer un code de vérification valide');
      return;
    }

    // Simuler la vérification du code
    // Dans un cas réel, vous vérifieriez le code avec votre API
    router.push('/claim-rewards');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Vérification',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Title style={styles.title}>Vérification de téléphone</Title>
          <Text style={styles.subtitle}>
            {!isCodeSent
              ? 'Entrez votre numéro de téléphone pour recevoir un code de vérification'
              : 'Entrez le code que vous avez reçu par SMS'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {!isCodeSent ? (
            <>
              <TextInput
                label="Numéro de téléphone"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="+33 6 12 34 56 78"
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <Button
                mode="contained"
                onPress={handleSendCode}
                style={styles.button}
              >
                Envoyer le code
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.phoneText}>
                Code envoyé au {phoneNumber}
              </Text>
              
              <TextInput
                label="Code de vérification"
                value={verificationCode}
                onChangeText={setVerificationCode}
                mode="outlined"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={6}
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <Button
                mode="contained"
                onPress={handleVerifyCode}
                style={styles.button}
              >
                Vérifier
              </Button>
              
              <Button
                mode="text"
                onPress={() => setIsCodeSent(false)}
                style={styles.textButton}
              >
                Changer de numéro
              </Button>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subtitle: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
    backgroundColor: '#4CAF50',
  },
  textButton: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  phoneText: {
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
  },
}); 