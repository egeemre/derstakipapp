// LoginScreen.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useLanguage } from '../localization/LanguageContext';
import { GOOGLE_CONFIG } from '../config/googleConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { language, t, toggleLanguage } = useLanguage();

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: GOOGLE_CONFIG.iosClientId,
      webClientId: GOOGLE_CONFIG.webClientId,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Here you would typically send the userInfo to your backend
      console.log(userInfo);
      alert(t.googleSignInSuccessful);
      // navigation.navigate('Home');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert(t.signInCancelled);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert(t.signInInProgress);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert(t.playServicesNotAvailable);
      } else {
        alert(t.somethingWentWrong + error.message);
      }
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email,
          password,
        });
        if (response.data.success) {
          alert(t.loginSuccessful);
          // navigation.navigate('Home'); // Başarılı giriş sonrası ana ekrana yönlendirme
        } else {
          alert(response.data.message || t.loginFailed);
        }
      } catch (error) {
        alert(t.error + (error.response?.data?.message || error.message));
      }
    } else {
      alert(t.pleaseEnterEmailPassword);
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

      <Text style={styles.title}>{t.login}</Text>
      <Image source={require('../../assets/illustration.png')} style={styles.illustration} />
      <View style={styles.inputContainer}>
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
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>{t.loginButton}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image 
          source={require('../../assets/google_logo.png')} 
          style={styles.googleLogo} 
        />
        <Text style={styles.googleButtonText}>{t.signInWithGoogle}</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>{t.forgotPassword}</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>{t.dontHaveAccount}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>{t.signUp}</Text>
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
    marginBottom: 16,
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  illustration: {
    width: 220,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  loginButton: {
    backgroundColor: '#222',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginBottom: 32,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  googleButtonText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#222',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: '#222',
    fontSize: 15,
  },
  signupLink: {
    color: '#222',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 15,
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
});
