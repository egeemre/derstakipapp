import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');

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
          alert('Sign up successful!');
          navigation.navigate('Login');
        } else {
          alert(response.data.message || 'Sign up failed');
        }
      } catch (error) {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>
        Already registered?{' '}
        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>Sign in</Text>
      </Text>
      <Image source={require('../../assets/signup_illustration.png')} style={styles.illustration} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Date of Birth"
          value={dob}
          onChangeText={setDob}
        />
      </View>
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>SIGN UP →</Text>
      </TouchableOpacity>
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
});
