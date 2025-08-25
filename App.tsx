import * as React from 'react';
import { View, StyleSheet } from 'react-native';

// Import all your screens
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PomodoroTimerScreen from './src/screens/PomodoroTimerScreen';
import VoiceRecorderScreen from './src/screens/VoiceRecorderScreen';
import TaskManagerScreen from './src/screens/TaskManagerScreen';
import StudyPlanScreen from './src/screens/StudyPlanScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import CalculatorScreen from './src/screens/CalculatorScreen';
import NotesScreen from './src/screens/NotesScreen';
import QuizzesScreen from './src/screens/QuizzesScreen';
import SummariesScreen from './src/screens/SummariesScreen';
import UploadDocumentsScreen from './src/screens/UploadDocumentsScreen';
import FileViewerScreen from './src/screens/FileViewerScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ToDoListScreen from './src/screens/ToDoListScreen';

// Import context providers
import { LanguageProvider } from './src/localization/LanguageContext';
import { UserProvider, useUser } from './src/context/UserContext';
import { ThemeProvider } from './src/theme/ThemeContext';

function AppNavigator() {
  const [currentScreen, setCurrentScreen] = React.useState('Login');
  const [screenParams, setScreenParams] = React.useState({});
  const { user, isLoading } = useUser();

  // Auto-redirect to login if user is not authenticated
  React.useEffect(() => {
    if (!isLoading) {
      if (!user && currentScreen !== 'Login' && currentScreen !== 'SignUp') {
        setCurrentScreen('Login');
      } else if (user && currentScreen === 'Login') {
        setCurrentScreen('Home');
      }
    }
  }, [user, isLoading, currentScreen]);

  // Navigation function that mimics React Navigation
  const navigate = (screenName: string, params: any = {}) => {
    setCurrentScreen(screenName);
    setScreenParams(params);
  };

  // Go back function
  const goBack = () => {
    // Simple back logic - you can enhance this with a navigation stack
    if (currentScreen !== 'Login') {
      setCurrentScreen('Home');
    }
  };

  // Create navigation object that screens expect
  const navigation = {
    navigate,
    goBack,
    replace: navigate, // For replacing current screen
    reset: (resetState: any) => {
      // Add reset functionality for compatibility
      if (resetState.routes && resetState.routes.length > 0) {
        setCurrentScreen(resetState.routes[0].name);
      }
    },
  };

  const renderScreen = () => {
    const screenProps = {
      navigation,
      route: { params: screenParams },
    };

    switch (currentScreen) {
      case 'Login':
        return <LoginScreen {...screenProps} />;
      case 'SignUp':
        return <SignUpScreen {...screenProps} />;
      case 'Home':
        return <HomeScreen {...screenProps} />;
      case 'Settings':
        return <SettingsScreen {...screenProps} />;
      case 'LanguageSelection':
        return <LanguageSelectionScreen {...screenProps} />;
      case 'PomodoroTimer':
        return <PomodoroTimerScreen {...screenProps} />;
      case 'VoiceRecorder':
        return <VoiceRecorderScreen {...screenProps} />;
      case 'TaskManager':
        return <TaskManagerScreen {...screenProps} />;
      case 'StudyPlan':
        return <StudyPlanScreen {...screenProps} />;
      case 'Flashcards':
        return <FlashcardsScreen {...screenProps} />;
      case 'Calculator':
        return <CalculatorScreen {...screenProps} />;
      case 'Notes':
        return <NotesScreen {...screenProps} />;
      case 'Quizzes':
        return <QuizzesScreen {...screenProps} />;
      case 'Summaries':
        return <SummariesScreen {...screenProps} />;
      case 'UploadDocuments':
        return <UploadDocumentsScreen {...screenProps} />;
      case 'FileViewer':
        return <FileViewerScreen {...screenProps} />;
      case 'Statistics':
        return <StatisticsScreen {...screenProps} />;
      case 'Achievements':
        return <AchievementsScreen {...screenProps} />;
      case 'ToDoList':
        return <ToDoListScreen {...screenProps} />;
      default:
        return <LoginScreen {...screenProps} />;
    }
  };

  return (
    <View style={styles.app}>
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
