import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useLanguage } from '../localization/LanguageContext';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  
  const { language, t, toggleLanguage } = useLanguage();

  const handleSignUp = async () => {
    if (name && email && password && dob) {
      try {
        const response = await axios.post('http://localhost:3000/signup', {
          name,
          email,
          password,
          dob,
        });
        if (response.data.success) {
          alert(t.signUpSuccessful);
          navigation.navigate('Login');
        } else {
          alert(response.data.message || t.signUpFailed);
        }
      } catch (error) {
        alert(t.error + (error.response?.data?.message || error.message));
      }
    } else {
      alert(t.pleaseFillAllFields);
    }
  };

  return (
    <View style={styles.container}>
      {/* Language Selector */}
      <TouchableOpacity style={styles.languageSelector} onPress={toggleLanguage}>
        <Text style={styles.languageText}>
          {language === 'en' ? 'EN | TR' : 'TR | EN'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t.signUpTitle}</Text>
      <Image source={require('../../assets/signup_illustration.png')} style={styles.illustration} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t.name}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.email}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={t.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t.dateOfBirth}
          value={dob}
          onChangeText={setDob}
        />
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>{t.signUpButton}</Text>
      </TouchableOpacity>
      
      {/* Already have account text below sign up button */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>{t.alreadyRegistered}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInLink}>{t.signIn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  signInLink: {
    color: '#222',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  illustration: {
    width: 260,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  signupButton: {
    backgroundColor: '#222',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageSelector: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    color: '#222',
    fontSize: 15,
  },
  signInLink: {
    color: '#222',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});
