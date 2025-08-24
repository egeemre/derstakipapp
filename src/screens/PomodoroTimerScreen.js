import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';

const PomodoroTimerScreen = React.memo(({ navigation }) => {
  const { t } = useLanguage();
  const [workTime, setWorkTime] = useState(25);
  const [restTime, setRestTime] = useState(5);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isRunning && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(time => time - 1);
      }, 1000);
    } else if (currentTime === 0) {
      // Switch between work and rest
      setIsWorkSession(!isWorkSession);
      setCurrentTime(isWorkSession ? restTime * 60 : workTime * 60);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime, workTime, restTime, isWorkSession]);

  // Memoize formatted time to avoid recalculation on every render
  const formattedTime = useMemo(() => {
    const mins = Math.floor(currentTime / 60);
    const secs = currentTime % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [currentTime]);

  // Use useCallback for timer controls
  const startTimer = useCallback(() => {
    if (isConfiguring) {
      setCurrentTime(workTime * 60);
      setIsConfiguring(false);
    }
    setIsRunning(true);
  }, [isConfiguring, workTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsWorkSession(true);
    setCurrentTime(workTime * 60);
    setIsConfiguring(true);
  }, [workTime]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.pomodoroTimer}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.sessionType}>
          {isWorkSession ? t.workTime : t.restTime}
        </Text>
        <Text style={styles.timerDisplay}>{formattedTime}</Text>
      </View>

      {/* Configuration */}
      {isConfiguring && (
        <View style={styles.configContainer}>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>{t.workTime}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.timeInput}
                value={workTime.toString()}
                onChangeText={(text) => setWorkTime(parseInt(text) || 25)}
                keyboardType="numeric"
              />
              <Text style={styles.minutesLabel}>{t.minutes}</Text>
            </View>
          </View>

          <View style={styles.configItem}>
            <Text style={styles.configLabel}>{t.restTime}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.timeInput}
                value={restTime.toString()}
                onChangeText={(text) => setRestTime(parseInt(text) || 5)}
                keyboardType="numeric"
              />
              <Text style={styles.minutesLabel}>{t.minutes}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.startButton} onPress={startTimer}>
            <Icon name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t.start}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
            <Icon name="pause" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t.pause}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
          <Icon name="refresh" size={24} color="#000" />
          <Text style={styles.resetButtonText}>{t.reset}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
  timerContainer: {
    alignItems: 'center',
    marginVertical: 48,
  },
  sessionType: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#000',
  },
  configContainer: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  configItem: {
    marginBottom: 24,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  minutesLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  startButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: '#ff6b6b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resetButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default PomodoroTimerScreen;