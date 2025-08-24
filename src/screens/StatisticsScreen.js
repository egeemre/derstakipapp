import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

export default function StatisticsScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Mock user progress data - same as AchievementsScreen for consistency
  const [userProgress] = useState({
    pagesUploaded: 47,
    timeStudied: 245, // in minutes
    documentsRead: 12,
    quizzesCompleted: 8,
    streakDays: 7,
    flashcardsReviewed: 156,
    notesCreated: 23,
    summariesGenerated: 15,
    perfectQuizzes: 3,
    toolsUsed: 5,
  });

  // Mock statistics data for the stat cards
  const [statistics] = useState({
    pagesUploaded: { current: userProgress.pagesUploaded },
    documentsRead: { current: userProgress.documentsRead },
    quizzesCompleted: { current: userProgress.quizzesCompleted },
    streakDays: { current: userProgress.streakDays },
  });

  // Generate 3 achievements from different categories with real progress data
  const firstThreeAchievements = useMemo(() => [
    {
      id: 1,
      title: t.firstSteps,
      description: t.firstStepsDesc,
      icon: 'cloud-upload',
      color: '#3B82F6',
      unlocked: userProgress.pagesUploaded >= 1,
      requirement: 1,
      current: userProgress.pagesUploaded,
      type: 'pagesUploaded'
    },
    {
      id: 5,
      title: t.studyBeginner,
      description: t.studyBeginnerDesc,
      icon: 'time',
      color: '#10B981',
      unlocked: userProgress.timeStudied >= 60,
      requirement: 60,
      current: userProgress.timeStudied,
      type: 'timeStudied'
    },
    {
      id: 8,
      title: t.firstReader,
      description: t.firstReaderDesc,
      icon: 'book',
      color: '#F59E0B',
      unlocked: userProgress.documentsRead >= 1,
      requirement: 1,
      current: userProgress.documentsRead,
      type: 'documentsRead'
    }
  ], [userProgress, t]);

  const StatCard = ({ icon, title, current, unit, color }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={[styles.statTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Text style={[styles.progressValue, { color: theme.colors.text }]}>{current}</Text>
        <Text style={[styles.progressUnit, { color: theme.colors.textSecondary }]}>{unit}</Text>
      </View>
    </View>
  );

  const AchievementItem = ({ achievement }) => (
    <View style={styles.achievementItem}>
      <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
        <Icon 
          name={achievement.unlocked ? achievement.icon : 'lock-closed'} 
          size={20} 
          color="#fff" 
        />
      </View>
      <View style={styles.achievementText}>
        <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDesc, { color: theme.colors.textSecondary }]}>
          {achievement.description}
        </Text>
        
        {!achievement.unlocked && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: achievement.color,
                    width: `${Math.min((achievement.current / achievement.requirement) * 100, 100)}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {achievement.current}/{achievement.requirement}
            </Text>
          </View>
        )}
      </View>
      
      {achievement.unlocked && (
        <Icon name="checkmark-circle" size={16} color={achievement.color} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t.statistics}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Statistics Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="cloud-upload-outline"
            title={t.pagesUploaded}
            current={statistics.pagesUploaded.current}
            unit={t.pages}
            color={theme.colors.accent}
          />
          
          <StatCard
            icon="document-text-outline"
            title={t.documentsRead}
            current={statistics.documentsRead.current}
            unit="docs"
            color="#F59E0B"
          />
          
          <StatCard
            icon="help-circle-outline"
            title={t.quizzesCompleted}
            current={statistics.quizzesCompleted.current}
            unit="quizzes"
            color="#EF4444"
          />
          
          <StatCard
            icon="flame-outline"
            title={t.studyStreak}
            current={statistics.streakDays.current}
            unit="days"
            color="#F97316"
          />
        </View>

        {/* Achievement Section */}
        <TouchableOpacity 
          style={[styles.achievementContainer, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('Achievements')}
          activeOpacity={0.7}
        >
          <View style={styles.achievementHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t.recentAchievements}</Text>
            <View style={styles.achievementHeaderRight}>
              <Text style={[styles.viewAllText, { color: theme.colors.accent }]}>{t.seeAll}</Text>
              <Icon name="chevron-forward" size={16} color={theme.colors.accent} />
            </View>
          </View>
          
          {firstThreeAchievements.map((achievement) => (
            <AchievementItem key={achievement.id} achievement={achievement} />
          ))}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressUnit: {
    fontSize: 10,
    textAlign: 'center',
  },
  achievementContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});