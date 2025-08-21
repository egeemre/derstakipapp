import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../localization/LanguageContext';
import { useUser } from '../context/UserContext';

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();
  const { user } = useUser();
  const [remainingPages, setRemainingPages] = useState(0);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [chevronAnimation] = useState(new Animated.Value(0));
  
  // Sample last files data
  const lastFiles = [
    { id: 1, name: 'biology', date: 'Friday, 10 September 2026', size: '3.4 mb', pages: 4 },
    { id: 2, name: 'what is life?', date: 'Saturday, 12 June 2026', size: '978 kb', pages: 1 },
    { id: 3, name: 'math formulas', date: 'Sunday, 25 August 2026', size: '4.6 mb', pages: 5 },
    { id: 4, name: 'physics formulas', date: 'Wednesday, 10 July 2026', size: '654 kb', pages: 2 },
  ];

  const tools = [
    { id: 1, name: t.pomodoroTimer, icon: 'timer-outline', screen: 'PomodoroTimer' },
    { id: 2, name: t.voiceRecorder, icon: 'mic-outline', screen: 'VoiceRecorder' },
    { id: 3, name: t.taskManager, icon: 'checkbox-outline', screen: 'TaskManager' },
    { id: 4, name: t.studyPlan, icon: 'calendar-outline', screen: 'StudyPlan' },
    { id: 5, name: t.flashcards, icon: 'layers-outline', screen: 'Flashcards' },
    { id: 6, name: t.calculator, icon: 'calculator-outline', screen: 'Calculator' },
  ];

  const toggleToolsMenu = () => {
    const toValue = toolsVisible ? 0 : 1;
    setToolsVisible(!toolsVisible);

    // Animate dropdown with non-native driver
    Animated.timing(animation, {
      toValue,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // Required for height animation
    }).start();

    // Animate chevron with native driver for better performance
    Animated.timing(chevronAnimation, {
      toValue,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true, // Can use native driver for transforms
    }).start();
  };

  const menuHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tools.length * 60],
  });

  const menuOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      {/* Header with name and settings */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          {t.welcomeBack}, {user?.name || 'User'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Remaining pages counter */}
        <View style={styles.counterContainer}>
          <Text style={styles.counterLabel}>{t.remaining}</Text>
          <View style={styles.counterBox}>
            <Text style={styles.counterNumber}>{remainingPages}</Text>
            <Text style={styles.counterText}>{t.pages}</Text>
            <TouchableOpacity style={styles.plusButton}>
              <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tools dropdown with exact design */}
        <View style={styles.toolsContainer}>
          <TouchableOpacity onPress={toggleToolsMenu} activeOpacity={0.8}>
            <LinearGradient
              colors={['#000000', '#404040']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.toolsBar}
            >
              <Text style={styles.toolsTitle}>Tools</Text>
              <Animated.View
                style={{
                  transform: [{
                    // Flip vertically when menu opens
                    scaleY: chevronAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, -1],
                    })
                  }]
                }}
              >
                <Icon name="chevron-down" size={24} color="#fff" />
              </Animated.View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Smooth dropdown menu */}
          <Animated.View 
            style={[
              styles.toolsDropdownMenu,
              {
                height: menuHeight,
                opacity: menuOpacity,
              }
            ]}
          >
            <View style={styles.toolsMenuContent}>
              {tools.map((tool, index) => (
                <TouchableOpacity
                  key={tool.id}
                  style={[
                    styles.toolMenuItem,
                    index === tools.length - 1 && styles.lastToolMenuItem,
                  ]}
                  onPress={() => {
                    toggleToolsMenu();
                    navigation.navigate(tool.screen);
                  }}
                >
                  <Icon name={tool.icon} size={20} color="#333" />
                  <Text style={styles.toolMenuItemText}>{tool.name}</Text>
                  <Icon name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>

        {/* Feature squares */}
        <View style={styles.featuresContainer}>
          <TouchableOpacity 
            style={styles.featureSquare} 
            onPress={() => navigation.navigate('Notes')}
          >
            <Icon name="document-text-outline" size={32} color="#000" />
            <Text style={styles.featureText}>{t.notes}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureSquare} 
            onPress={() => navigation.navigate('Quizzes')}
          >
            <Icon name="help-circle-outline" size={32} color="#000" />
            <Text style={styles.featureText}>{t.quizzes}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureSquare} 
            onPress={() => navigation.navigate('Summaries')}
          >
            <Icon name="reader-outline" size={32} color="#000" />
            <Text style={styles.featureText}>{t.summaries}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureSquare} 
            onPress={() => navigation.navigate('UploadDocuments')}
          >
            <Icon name="cloud-upload-outline" size={32} color="#000" />
            <Text style={styles.featureText}>{t.uploadDocuments}</Text>
          </TouchableOpacity>
        </View>

        {/* Last files section */}
        <View style={styles.lastFilesSection}>
          <Text style={styles.sectionTitle}>{t.lastFiles}</Text>
          {lastFiles.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={styles.fileItem}
              onPress={() => navigation.navigate('FileViewer', { file: file })}
            >
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileDate}>{file.date}</Text>
              </View>
              <View style={styles.fileStats}>
                <Text style={styles.fileSize}>{file.size}</Text>
                <Text style={styles.filePages}>{file.pages} {t.pages}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  counterContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  counterLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  counterBox: {
    backgroundColor: '#e5e5e5',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  counterText: {
    fontSize: 18,
    color: '#000',
    flex: 1,
    marginLeft: 8,
  },
  plusButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  toolsBar: {
    width: '100%', 
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toolsTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  toolsDropdownMenu: {
    overflow: 'hidden',
    marginTop: 8,
  },
  toolsMenuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  toolMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    height: 60,
  },
  lastToolMenuItem: {
    borderBottomWidth: 0,
  },
  toolMenuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureSquare: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#e5e5e5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  lastFilesSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  fileDate: {
    fontSize: 12,
    color: '#666',
  },
  fileStats: {
    alignItems: 'flex-end',
  },
  fileSize: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  filePages: {
    fontSize: 12,
    color: '#666',
  },
});