import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useUser } from '../context/UserContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useTheme } from '../theme/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { language, t, toggleLanguage } = useLanguage();
  const { user, clearUser } = useUser();
  const { themeName, toggleTheme, theme } = useTheme();

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t.settings}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* User Info */}
      {user && (
        <View style={[styles.userInfo, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{user.email}</Text>
          <Text style={[styles.loginMethod, { color: theme.colors.textSecondary }]}>
            {user.loginMethod === 'google' ? 'Google Account' : 'Local Account'}
          </Text>
        </View>
      )}

      {/* Settings Options */}
      <View style={styles.settingsContainer}>
        {/* Language Setting */}
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
          onPress={() => navigation.navigate('LanguageSelection')}
        >
          <View style={styles.settingLeft}>
            <Icon name="language-outline" size={24} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{t.language}</Text>
          </View>
          <View style={styles.languageInfo}>
            <Text style={[styles.currentLanguage, { color: theme.colors.textSecondary }]}>
              {language === 'en' ? 'English' : 
               language === 'tr' ? 'Türkçe' : 
               language === 'de' ? 'Deutsch' : 
               language === 'es' ? 'Español' : 
               language === 'it' ? 'Italiano' : 
               language === 'ru' ? 'Русский' : 
               language === 'zh' ? '中文' : 'English'}
            </Text>
            <Icon name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </View>
        </TouchableOpacity>

        {/* Theme Setting */}
        <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
          <View style={styles.settingLeft}>
            <Icon name="moon-outline" size={24} color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>{t.theme}</Text>
          </View>
          <View style={styles.themeContainer}>
            <Text style={[styles.themeLabel, { color: theme.colors.textSecondary }]}>
              {themeName === 'dark' ? t.darkMode : t.lightMode}
            </Text>
            <Switch
              value={themeName === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#e5e5e5', true: '#000000' }}
              thumbColor={themeName === 'dark' ? '#ffffff' : '#000000'}
              ios_backgroundColor="#e5e5e5"
            />
          </View>
        </View>

        {/* Logout Setting */}
        <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <View style={styles.settingLeft}>
            <Icon name="log-out-outline" size={24} color={theme.colors.danger} />
            <Text style={[styles.settingText, { color: theme.colors.danger }]}>{t.logout}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  userInfo: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  loginMethod: {
    fontSize: 12,
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
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 16,
    fontSize: 16,
  },
  languageToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeLabel: {
    marginRight: 12,
    fontSize: 14,
  },
  currentLanguage: {
    fontSize: 16,
    marginRight: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});