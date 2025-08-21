import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useUser } from '../context/UserContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function SettingsScreen({ navigation }) {
  const { language, t, toggleLanguage } = useLanguage();
  const { user, clearUser } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out from Google if logged in via Google
              if (user?.loginMethod === 'google') {
                await GoogleSignin.signOut();
              }
              // Clear user data from storage
              await clearUser();
              // Navigate back to login
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.log('Logout error:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.settings}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* User Info */}
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.loginMethod}>
            {user.loginMethod === 'google' ? 'Google Account' : 'Local Account'}
          </Text>
        </View>
      )}

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        {/* Language Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="language-outline" size={24} color="#000" />
            <Text style={styles.settingText}>{t.language}</Text>
          </View>
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
            <Text style={styles.languageText}>
              {language === 'en' ? 'EN' : 'TR'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme Setting */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Icon name="moon-outline" size={24} color="#000" />
            <Text style={styles.settingText}>{t.theme}</Text>
          </View>
          <View style={styles.themeContainer}>
            <Text style={styles.themeLabel}>
              {isDarkMode ? t.darkMode : t.lightMode}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#e5e5e5', true: '#000' }}
              thumbColor={isDarkMode ? '#fff' : '#000'}
            />
          </View>
        </View>

        {/* Logout Setting */}
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <View style={styles.settingLeft}>
            <Icon name="log-out-outline" size={24} color="#ff6b6b" />
            <Text style={[styles.settingText, { color: '#ff6b6b' }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  userInfo: {
    backgroundColor: '#f8f8f8',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loginMethod: {
    fontSize: 12,
    color: '#999',
  },
  settingsContainer: {
    paddingHorizontal: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#000',
  },
  languageToggle: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    marginRight: 12,
    fontSize: 14,
    color: '#666',
  },
});