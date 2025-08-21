import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import { LanguageProvider } from './src/localization/LanguageContext';
import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PomodoroTimer"
              component={PomodoroTimerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="VoiceRecorder"
              component={VoiceRecorderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TaskManager"
              component={TaskManagerScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StudyPlan"
              component={StudyPlanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Flashcards"
              component={FlashcardsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Calculator"
              component={CalculatorScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Notes"
              component={NotesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Quizzes"
              component={QuizzesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Summaries"
              component={SummariesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UploadDocuments"
              component={UploadDocumentsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FileViewer"
              component={FileViewerScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </UserProvider>
  );
}
