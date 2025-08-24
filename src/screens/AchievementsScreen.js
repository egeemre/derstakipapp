import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

export default function AchievementsScreen({ navigation }) {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Mock user progress data - in a real app, this would come from your data store
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
    weeklyGoalsMet: 2,
    monthlyActive: 1,
    studySessionsCompleted: 34,
    averageQuizScore: 85,
    consecutiveLogins: 7,
    toolsUsed: 5,
  });

  // All 25 achievements with their unlock conditions
  const achievements = useMemo(() => {
    const baseAchievements = [
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
        id: 2,
        title: t.gettingStarted,
        description: t.gettingStartedDesc,
        icon: 'document-text',
        color: '#3B82F6',
        unlocked: userProgress.pagesUploaded >= 10,
        requirement: 10,
        current: userProgress.pagesUploaded,
        type: 'pagesUploaded'
      },
      {
        id: 3,
        title: t.contentCreator,
        description: t.contentCreatorDesc,
        icon: 'library',
        color: '#3B82F6',
        unlocked: userProgress.pagesUploaded >= 50,
        requirement: 50,
        current: userProgress.pagesUploaded,
        type: 'pagesUploaded'
      },
      {
        id: 4,
        title: t.documentMaster,
        description: t.documentMasterDesc,
        icon: 'albums',
        color: '#3B82F6',
        unlocked: userProgress.pagesUploaded >= 100,
        requirement: 100,
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
        id: 6,
        title: t.dedicatedLearner,
        description: t.dedicatedLearnerDesc,
        icon: 'timer',
        color: '#10B981',
        unlocked: userProgress.timeStudied >= 300,
        requirement: 300,
        current: userProgress.timeStudied,
        type: 'timeStudied'
      },
      {
        id: 7,
        title: t.studyChampion,
        description: t.studyChampionDesc,
        icon: 'stopwatch',
        color: '#10B981',
        unlocked: userProgress.timeStudied >= 600,
        requirement: 600,
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
      },
      {
        id: 9,
        title: t.bookworm,
        description: t.bookwormDesc,
        icon: 'book-outline',
        color: '#F59E0B',
        unlocked: userProgress.documentsRead >= 10,
        requirement: 10,
        current: userProgress.documentsRead,
        type: 'documentsRead'
      },
      {
        id: 10,
        title: t.speedReader,
        description: t.speedReaderDesc,
        icon: 'flash',
        color: '#F59E0B',
        unlocked: userProgress.documentsRead >= 25,
        requirement: 25,
        current: userProgress.documentsRead,
        type: 'documentsRead'
      },
      {
        id: 11,
        title: t.quizStarter,
        description: t.quizStarterDesc,
        icon: 'help-circle',
        color: '#EF4444',
        unlocked: userProgress.quizzesCompleted >= 1,
        requirement: 1,
        current: userProgress.quizzesCompleted,
        type: 'quizzesCompleted'
      },
      {
        id: 12,
        title: t.quizExplorer,
        description: t.quizExplorerDesc,
        icon: 'help',
        color: '#EF4444',
        unlocked: userProgress.quizzesCompleted >= 5,
        requirement: 5,
        current: userProgress.quizzesCompleted,
        type: 'quizzesCompleted'
      },
      {
        id: 13,
        title: t.quizMaster,
        description: t.quizMasterDesc,
        icon: 'school',
        color: '#EF4444',
        unlocked: userProgress.quizzesCompleted >= 15,
        requirement: 15,
        current: userProgress.quizzesCompleted,
        type: 'quizzesCompleted'
      },
      {
        id: 14,
        title: t.perfectScore,
        description: t.perfectScoreDesc,
        icon: 'trophy',
        color: '#F97316',
        unlocked: userProgress.perfectQuizzes >= 1,
        requirement: 1,
        current: userProgress.perfectQuizzes,
        type: 'perfectQuizzes'
      },
      {
        id: 15,
        title: t.firstWeek,
        description: t.firstWeekDesc,
        icon: 'flame',
        color: '#F97316',
        unlocked: userProgress.streakDays >= 7,
        requirement: 7,
        current: userProgress.streakDays,
        type: 'streakDays'
      },
      {
        id: 16,
        title: t.twoWeeksStrong,
        description: t.twoWeeksStrongDesc,
        icon: 'bonfire',
        color: '#F97316',
        unlocked: userProgress.streakDays >= 14,
        requirement: 14,
        current: userProgress.streakDays,
        type: 'streakDays'
      },
      {
        id: 17,
        title: t.monthlyWarrior,
        description: t.monthlyWarriorDesc,
        icon: 'medal',
        color: '#F97316',
        unlocked: userProgress.streakDays >= 30,
        requirement: 30,
        current: userProgress.streakDays,
        type: 'streakDays'
      },
      {
        id: 18,
        title: t.cardCollector,
        description: t.cardCollectorDesc,
        icon: 'layers',
        color: '#8B5CF6',
        unlocked: userProgress.flashcardsReviewed >= 50,
        requirement: 50,
        current: userProgress.flashcardsReviewed,
        type: 'flashcardsReviewed'
      },
      {
        id: 19,
        title: t.memoryMaster,
        description: t.memoryMasterDesc,
        icon: 'library-outline',
        color: '#8B5CF6',
        unlocked: userProgress.flashcardsReviewed >= 200,
        requirement: 200,
        current: userProgress.flashcardsReviewed,
        type: 'flashcardsReviewed'
      },
      {
        id: 20,
        title: t.noteTaker,
        description: t.noteTakerDesc,
        icon: 'create',
        color: '#06B6D4',
        unlocked: userProgress.notesCreated >= 10,
        requirement: 10,
        current: userProgress.notesCreated,
        type: 'notesCreated'
      },
      {
        id: 21,
        title: t.summaryExpert,
        description: t.summaryExpertDesc,
        icon: 'reader',
        color: '#06B6D4',
        unlocked: userProgress.summariesGenerated >= 10,
        requirement: 10,
        current: userProgress.summariesGenerated,
        type: 'summariesGenerated'
      },
      {
        id: 22,
        title: t.toolExplorer,
        description: t.toolExplorerDesc,
        icon: 'construct',
        color: '#8B5CF6',
        unlocked: userProgress.toolsUsed >= 5,
        requirement: 5,
        current: userProgress.toolsUsed,
        type: 'toolsUsed'
      },
      {
        id: 23,
        title: t.earlyBird,
        description: t.earlyBirdDesc,
        icon: 'sunny',
        color: '#F59E0B',
        unlocked: false,
        requirement: 1,
        current: 0,
        type: 'special'
      },
      {
        id: 24,
        title: t.nightOwl,
        description: t.nightOwlDesc,
        icon: 'moon',
        color: '#6366F1',
        unlocked: false,
        requirement: 1,
        current: 0,
        type: 'special'
      }
    ];

    // Calculate unlocked count for Scholar achievement
    const unlockedCount = baseAchievements.filter(a => a.unlocked).length;

    // Add the Scholar achievement separately to avoid circular dependency
    const scholarAchievement = {
      id: 25,
      title: t.scholar,
      description: t.scholarDesc,
      icon: 'ribbon',
      color: '#DC2626',
      unlocked: unlockedCount >= 15,
      requirement: 15,
      current: unlockedCount,
      type: 'meta'
    };

    return [...baseAchievements, scholarAchievement];
  }, [userProgress, t]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  const AchievementCard = ({ achievement }) => (
    <View style={[
      styles.achievementCard, 
      { 
        backgroundColor: theme.colors.surfaceAlt, 
        borderColor: achievement.unlocked ? achievement.color : theme.colors.border,
        opacity: achievement.unlocked ? 1 : 0.6
      }
    ]}>
      <View style={[styles.achievementIconContainer, { backgroundColor: achievement.color }]}>
        <Icon 
          name={achievement.unlocked ? achievement.icon : 'lock-closed'} 
          size={24} 
          color="#fff" 
        />
      </View>
      
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
          {achievement.description}
        </Text>
        
        {!achievement.unlocked && achievement.type !== 'special' && achievement.type !== 'meta' && (
          <View style={styles.progressContainer}>
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
        <Icon name="checkmark-circle" size={20} color={achievement.color} />
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
        <Text style={[styles.title, { color: theme.colors.text }]}>{t.achievements}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Summary */}
      <View style={[styles.progressSummary, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
        <View style={styles.summaryContent}>
          <Text style={[styles.progressTitle, { color: theme.colors.text }]}>{t.yourProgress}</Text>
          <Text style={[styles.progressStats, { color: theme.colors.textSecondary }]}>
            {unlockedCount} {t.of} {achievements.length} {t.achievementsUnlocked}
          </Text>
          <View style={styles.overallProgressContainer}>
            <View style={[styles.overallProgressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.overallProgressFill, 
                  { 
                    backgroundColor: theme.colors.accent,
                    width: `${progressPercentage}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressPercentageText, { color: theme.colors.accent }]}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </View>
        <View style={styles.trophyContainer}>
          <Icon name="trophy" size={40} color={theme.colors.accent} />
        </View>
      </View>

      {/* Achievements List */}
      <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
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
  progressSummary: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressStats: {
    fontSize: 14,
    marginBottom: 4,
  },
  overallProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressPercentageText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trophyContainer: {
    marginLeft: 16,
  },
  achievementsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
});