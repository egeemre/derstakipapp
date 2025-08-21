import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../localization/LanguageContext';

export default function QuizzesScreen({ navigation }) {
  const { t } = useLanguage();
  const [quizzes] = useState([
    { id: 1, title: 'Biology Quiz', questions: 10, completed: true, score: 85 },
    { id: 2, title: 'Math Quiz', questions: 15, completed: false, score: null },
    { id: 3, title: 'Physics Quiz', questions: 12, completed: true, score: 92 },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.quizzes}</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Quizzes List */}
      <ScrollView style={styles.quizzesContainer} showsVerticalScrollIndicator={false}>
        {quizzes.map((quiz) => (
          <TouchableOpacity key={quiz.id} style={styles.quizItem}>
            <View style={styles.quizIcon}>
              <Ionicons name="help-circle" size={24} color="#000" />
            </View>
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <Text style={styles.quizQuestions}>{quiz.questions} questions</Text>
              {quiz.completed && (
                <Text style={styles.quizScore}>Score: {quiz.score}%</Text>
              )}
            </View>
            <View style={styles.quizStatus}>
              {quiz.completed ? (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              ) : (
                <Ionicons name="play-circle" size={24} color="#000" />
              )}
            </View>
          </TouchableOpacity>
        ))}
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
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  quizzesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  quizItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  quizIcon: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  quizQuestions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  quizScore: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  quizStatus: {
    padding: 8,
  },
});