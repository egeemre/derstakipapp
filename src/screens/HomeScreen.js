import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Easing, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../localization/LanguageContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../theme/ThemeContext';

const HomeScreen = React.memo(({ navigation }) => {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const { theme } = useTheme();
  const [remainingPages, setRemainingPages] = useState(0);
  const [toolsVisible, setToolsVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [chevronAnimation] = useState(new Animated.Value(0));
  const [lastFilesTitleWidth, setLastFilesTitleWidth] = useState(null);

  // Configure the maximum number of files to show before "See all" link
  const MAX_FILES_DISPLAY = 3;

  const lastFiles = [
    { id: 1, name: 'biology', date: new Date(2026, 8, 10), size: '3.4 mb', pages: 4 },
    { id: 2, name: 'what is life?', date: new Date(2026, 5, 12), size: '978 kb', pages: 1 },
    { id: 3, name: 'math formulas', date: new Date(2026, 7, 25), size: '4.6 mb', pages: 5 },
    { id: 4, name: 'physics formulas', date: new Date(2026, 6, 10), size: '654 kb', pages: 2 },
  ];

  // For testing empty state, you can uncomment this line:
   //const lastFiles = [];

  const formatDate = (d) => {
    try {
      const locale = language === 'tr' ? 'tr-TR' : 'en-US';
      return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch (e) {
      return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    }
  };

  const tools = useMemo(() => [
    { id: 1, name: t.pomodoroTimer, icon: 'timer-outline', screen: 'PomodoroTimer' },
    { id: 2, name: t.voiceRecorder, icon: 'mic-outline', screen: 'VoiceRecorder' },
    { id: 3, name: t.taskManager, icon: 'checkbox-outline', screen: 'TaskManager' },
    { id: 4, name: t.studyPlan, icon: 'calendar-outline', screen: 'StudyPlan' },
    { id: 5, name: t.flashcards, icon: 'layers-outline', screen: 'Flashcards' },
    { id: 6, name: t.calculator, icon: 'calculator-outline', screen: 'Calculator' },
  ], [t]);

  const formattedLastFiles = useMemo(() => 
    lastFiles.map(file => ({
      ...file,
      formattedDate: formatDate(file.date)
    })), [lastFiles, language]
  );

  const toggleToolsMenu = useCallback(() => {
    const toValue = toolsVisible ? 0 : 1;
    setToolsVisible(!toolsVisible);

    Animated.timing(animation, {
      toValue,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.timing(chevronAnimation, {
      toValue,
      duration: 340,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [toolsVisible, animation, chevronAnimation]);

  const handleToolNavigation = useCallback((screen) => {
    toggleToolsMenu();
    navigation.navigate(screen);
  }, [navigation, toggleToolsMenu]);

  const handleFilePress = useCallback((file) => {
    navigation.navigate('FileViewer', { file });
  }, [navigation]);

  const handleSeeAllFiles = useCallback(() => {
    navigation.navigate('UploadDocuments');
  }, [navigation]);

  const menuHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tools.length * 60],
  });

  const menuOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              {t.welcomeBack}, {user?.name || 'User'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Icon name="settings-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.counterContainer}>
            <Text style={[styles.counterLabel, { color: theme.colors.textSecondary }]}>{t.remaining}</Text>
            <View style={[styles.counterBox, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
              <Text style={[styles.counterNumber, { color: theme.colors.text }]}>{remainingPages}</Text>
              <Text style={[styles.counterText, { color: theme.colors.text }]}>{t.pages}</Text>
              <TouchableOpacity style={[styles.plusButton, { backgroundColor: theme.colors.primary }]}>
                <Icon name="add" size={24} color={theme.colors.background} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.toolsContainer}>
            <TouchableOpacity onPress={toggleToolsMenu} activeOpacity={0.8}>
              <LinearGradient
                colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.toolsBar}
              >
                <View style={styles.iconSwapContainer}>
                  <Animated.View
                    style={[
                      styles.iconLayer,
                      {
                        opacity: chevronAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                        transform: [
                          { scale: chevronAnimation.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) },
                          { rotate: chevronAnimation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }) },
                        ],
                      },
                    ]}
                  >
                    <Icon name="menu-outline" size={26} color="#fff" />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.iconLayer,
                      {
                        opacity: chevronAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                        transform: [
                          { scale: chevronAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
                          { rotate: chevronAnimation.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
                        ],
                      },
                    ]}
                  >
                    <Icon name="close-outline" size={26} color="#fff" />
                  </Animated.View>
                </View>
                <Text style={styles.toolsTitle}>{t.tools}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.toolsDropdownMenu,
                {
                  height: menuHeight,
                  opacity: menuOpacity,
                }
              ]}
            >
              <View style={[styles.toolsMenuContent, { backgroundColor: theme.colors.surfaceElevated }]}>
                {tools.map((tool, index) => (
                  <TouchableOpacity
                    key={tool.id}
                    style={[
                      styles.toolMenuItem,
                      index === tools.length - 1 && styles.lastToolMenuItem,
                    ]}
                    onPress={() => handleToolNavigation(tool.screen)}
                  >
                    <Icon name={tool.icon} size={20} color={theme.colors.text} />
                    <Text style={[styles.toolMenuItemText, { color: theme.colors.text }]}>{tool.name}</Text>
                    <Icon name="chevron-forward" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>

          <View style={styles.featuresContainer}>
            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Notes')}
            >
              <LinearGradient 
                colors={theme.name === 'dark' ? ['#2a2d32', '#1f2328'] : ['#ececec', '#ffffff']} 
                start={{x:0,y:0}} 
                end={{x:1,y:1}} 
                style={StyleSheet.absoluteFill} 
              />
              <Icon name="document-text-outline" size={32} color={theme.colors.text} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>{t.notes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Quizzes')}
            >
              <LinearGradient 
                colors={theme.name === 'dark' ? ['#2a2d32', '#1f2328'] : ['#ececec', '#ffffff']} 
                start={{x:0,y:0}} 
                end={{x:1,y:1}} 
                style={StyleSheet.absoluteFill} 
              />
              <Icon name="help-circle-outline" size={32} color={theme.colors.text} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>{t.quizzes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Summaries')}
            >
              <LinearGradient 
                colors={theme.name === 'dark' ? ['#2a2d32', '#1f2328'] : ['#ececec', '#ffffff']} 
                start={{x:0,y:0}} 
                end={{x:1,y:1}} 
                style={StyleSheet.absoluteFill} 
              />
              <Icon name="reader-outline" size={32} color={theme.colors.text} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>{t.summaries}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.featureCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('UploadDocuments')}
            >
              <LinearGradient 
                colors={theme.name === 'dark' ? ['#2a2d32', '#1f2328'] : ['#ececec', '#ffffff']} 
                start={{x:0,y:0}} 
                end={{x:1,y:1}} 
                style={StyleSheet.absoluteFill} 
              />
              <Icon name="cloud-upload-outline" size={32} color={theme.colors.text} />
              <Text style={[styles.featureText, { color: theme.colors.text }]}>{t.uploadDocuments}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lastFilesSection}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.text }]}
              onLayout={e => setLastFilesTitleWidth(e.nativeEvent.layout.width)}
            >
              {t.lastFiles}
            </Text>
            {lastFilesTitleWidth !== null && (
              <View style={[styles.sectionUnderline, { width: lastFilesTitleWidth, backgroundColor: theme.colors.primary }]} />
            )}
            {formattedLastFiles.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="document-outline" size={48} color={theme.colors.textSecondary} style={styles.emptyStateIcon} />
                <Text style={[styles.emptyStateTitle, { color: theme.colors.textSecondary }]}>{t.noRecentFiles}</Text>
                <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>{t.noRecentFilesSubtext}</Text>
                <TouchableOpacity 
                  style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => navigation.navigate('UploadDocuments')}
                >
                  <Text style={[styles.emptyStateButtonText, { color: theme.colors.background }]}>{t.uploadDocuments}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {formattedLastFiles.slice(0, MAX_FILES_DISPLAY).map((file, index) => (
                  <View key={file.id}>
                    <TouchableOpacity
                      style={styles.fileItem}
                      onPress={() => handleFilePress(file)}
                    >
                      <View style={styles.fileInfo}>
                        <Text style={[styles.fileName, { color: theme.colors.text }]}>{file.name}</Text>
                        <Text style={[styles.fileDate, { color: theme.colors.textSecondary }]}>{file.formattedDate}</Text>
                      </View>
                      <View style={styles.fileStats}>
                        <Text style={[styles.filePages, { color: theme.colors.text }]}>{file.pages} {t.pages}</Text>
                        <Text style={[styles.fileSize, { color: theme.colors.textSecondary }]}>{file.size}</Text>
                      </View>
                    </TouchableOpacity>
                    {index < Math.min(formattedLastFiles.length, MAX_FILES_DISPLAY) - 1 && lastFilesTitleWidth !== null && (
                      <View style={[styles.fileDivider, { width: lastFilesTitleWidth, backgroundColor: theme.colors.border }]} />
                    )}
                  </View>
                ))}
                {formattedLastFiles.length > MAX_FILES_DISPLAY && (
                  <TouchableOpacity onPress={handleSeeAllFiles} style={styles.seeAllContainer}>
                    <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>{t.seeAll}</Text>
                    <Icon name="chevron-forward" size={16} color={theme.colors.primary} style={styles.seeAllIcon} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterContainer: {
    marginBottom: 24,
  },
  counterLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  counterBox: {
    borderRadius: 18,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  counterNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 18,
    flex: 1,
    marginLeft: 8,
  },
  plusButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolsContainer: {
    marginBottom: 24,
  },
  toolsBar: {
    width: '100%',
    height: 56,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  toolsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#ffffff',
  },
  toolsDropdownMenu: {
    overflow: 'hidden',
    marginTop: 8,
  },
  toolsMenuContent: {
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
    height: 60,
  },
  lastToolMenuItem: {
    borderBottomWidth: 0,
  },
  toolMenuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    overflow: 'hidden',
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  lastFilesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionUnderline: {
    height: 3,
    marginBottom: 6,
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  fileDivider: {
    height: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileDate: {
    fontSize: 12,
  },
  fileStats: {
    alignItems: 'flex-end',
  },
  fileSize: {
    fontSize: 12,
    marginBottom: 0,
  },
  filePages: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  chevronContainer: {
    marginLeft: 'auto',
  },
  toolsMenuIcon: {
    marginRight: 12,
  },
  iconSwapContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconLayer: {
    position: 'absolute',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 16,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  seeAllIcon: {
    marginLeft: 4,
  },
});

export default HomeScreen;