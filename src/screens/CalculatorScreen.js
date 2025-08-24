import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

const GPACalculatorScreen = React.memo(({ navigation }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [courses, setCourses] = useState([
    { id: 1, name: '', grade: '', credits: '' }
  ]);
  const [gpaResult, setGpaResult] = useState(null);
  const [gradingSystem, setGradingSystem] = useState('standard'); // 'standard' or 'letter'

  // Standard grade point mappings (4.0 scale)
  const standardGradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  // Letter grade point mappings
  const letterGradePoints = {
    'AA': 4.00,
    'BA': 3.50,
    'BB': 3.00,
    'CB': 2.50,
    'CC': 2.00,
    'DC': 1.50,
    'DD': 1.00,
    'FF': 0.00
  };

  const gradePoints = gradingSystem === 'standard' ? standardGradePoints : letterGradePoints;
  const gradeOptions = Object.keys(gradePoints);

  const addCourse = useCallback(() => {
    const newCourse = {
      id: Date.now(),
      name: '',
      grade: '',
      credits: ''
    };
    setCourses(prev => [...prev, newCourse]);
  }, []);

  const removeCourse = useCallback((id) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter(course => course.id !== id));
    }
  }, [courses.length]);

  const updateCourse = useCallback((id, field, value) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  }, []);

  const calculateGPA = useCallback(() => {
    const validCourses = courses.filter(course => 
      course.grade && course.credits && !isNaN(parseFloat(course.credits))
    );

    if (validCourses.length === 0) {
      Alert.alert(t.error.replace(': ', ''), t.pleaseFillAllFields);
      return;
    }

    let totalPoints = 0;
    let totalCredits = 0;

    validCourses.forEach(course => {
      const credits = parseFloat(course.credits);
      const points = gradePoints[course.grade] || 0;
      totalPoints += points * credits;
      totalCredits += credits;
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    setGpaResult({
      gpa: gpa.toFixed(2),
      totalCredits: totalCredits.toFixed(1),
      coursesCount: validCourses.length
    });
  }, [courses, gradePoints, t]);

  const resetCalculator = useCallback(() => {
    setCourses([{ id: 1, name: '', grade: '', credits: '' }]);
    setGpaResult(null);
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t.gpaCalculator}</Text>
        <TouchableOpacity onPress={resetCalculator}>
          <Icon name="refresh-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* GPA Result */}
        {gpaResult && (
          <View style={[styles.resultContainer, { backgroundColor: theme.colors.accent + '20', borderColor: theme.colors.accent }]}>
            <View style={styles.resultHeader}>
              <Icon name="school-outline" size={24} color={theme.colors.accent} />
              <Text style={[styles.resultTitle, { color: theme.colors.text }]}>{t.yourGPA}</Text>
            </View>
            <Text style={[styles.gpaValue, { color: theme.colors.accent }]}>{gpaResult.gpa}</Text>
            <Text style={[styles.resultDetails, { color: theme.colors.textSecondary }]}>
              {t.basedOnCourses} {gpaResult.coursesCount} {t.courses.toLowerCase()} • {gpaResult.totalCredits} {t.totalCredits}
            </Text>
            <View style={styles.gpaScale}>
              <Text style={[styles.scaleText, { color: theme.colors.textSecondary }]}>
                Scale: 4.0 (A) - 0.0 (F)
              </Text>
            </View>
          </View>
        )}

        {/* Grading System Toggle */}
        <View style={[styles.gradingSystemContainer, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
          <Text style={[styles.gradingSystemTitle, { color: theme.colors.text }]}>{t.gradingSystem}</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                {
                  backgroundColor: gradingSystem === 'standard' ? theme.colors.accent : theme.colors.surface,
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => setGradingSystem('standard')}
            >
              <Text style={[
                styles.toggleText,
                { color: gradingSystem === 'standard' ? '#fff' : theme.colors.text }
              ]}>
                {t.standardGrading}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleOption,
                {
                  backgroundColor: gradingSystem === 'letter' ? theme.colors.accent : theme.colors.surface,
                  borderColor: theme.colors.border
                }
              ]}
              onPress={() => setGradingSystem('letter')}
            >
              <Text style={[
                styles.toggleText,
                { color: gradingSystem === 'letter' ? '#fff' : theme.colors.text }
              ]}>
                {t.letterGrading}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Courses List */}
        <View style={styles.coursesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t.courses}</Text>
            <TouchableOpacity onPress={addCourse} style={[styles.addButton, { backgroundColor: theme.colors.accent }]}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {courses.map((course, index) => (
            <View key={course.id} style={[styles.courseCard, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
              <View style={styles.courseHeader}>
                <Text style={[styles.courseNumber, { color: theme.colors.textSecondary }]}>{t.courses} {index + 1}</Text>
                {courses.length > 1 && (
                  <TouchableOpacity onPress={() => removeCourse(course.id)}>
                    <Icon name="trash-outline" size={20} color={theme.colors.danger} />
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={[styles.courseInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                placeholder={t.courseName}
                placeholderTextColor={theme.colors.textSecondary}
                value={course.name}
                onChangeText={(value) => updateCourse(course.id, 'name', value)}
              />

              <View style={styles.gradeCreditsRow}>
                <View style={styles.gradeContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t.grade}</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gradeOptions}>
                    {gradeOptions.map((grade) => (
                      <TouchableOpacity
                        key={grade}
                        style={[
                          styles.gradeOption,
                          { 
                            backgroundColor: course.grade === grade ? theme.colors.accent : theme.colors.surface,
                            borderColor: theme.colors.border
                          }
                        ]}
                        onPress={() => updateCourse(course.id, 'grade', grade)}
                      >
                        <Text style={[
                          styles.gradeOptionText,
                          { color: course.grade === grade ? '#fff' : theme.colors.text }
                        ]}>
                          {grade}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.creditsContainer}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>{t.credits}</Text>
                  <TextInput
                    style={[styles.creditsInput, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                    placeholder="3.0"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={course.credits}
                    onChangeText={(value) => updateCourse(course.id, 'credits', value)}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: theme.colors.accent }]}
          onPress={calculateGPA}
          activeOpacity={0.8}
        >
          <Icon name="calculator-outline" size={20} color="#fff" />
          <Text style={styles.calculateButtonText}>{t.calculateGPA}</Text>
        </TouchableOpacity>

        {/* Grade Scale Reference */}
        <View style={[styles.scaleContainer, { backgroundColor: theme.colors.surfaceAlt, borderColor: theme.colors.border }]}>
          <Text style={[styles.scaleTitle, { color: theme.colors.text }]}>{t.gradeScaleReference}</Text>
          <View style={styles.scaleGrid}>
            {Object.entries(gradePoints).map(([grade, points]) => (
              <View key={grade} style={styles.scaleItem}>
                <Text style={[styles.scaleGrade, { color: theme.colors.text }]}>{grade}</Text>
                <Text style={[styles.scalePoints, { color: theme.colors.textSecondary }]}>{points}</Text>
              </View>
            ))}
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
  resultContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gpaValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultDetails: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  gpaScale: {
    marginTop: 4,
  },
  scaleText: {
    fontSize: 12,
  },
  coursesContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  courseInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  gradeCreditsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeContainer: {
    flex: 2,
    marginRight: 12,
  },
  creditsContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  gradeOptions: {
    flexDirection: 'row',
  },
  gradeOption: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 1,
  },
  gradeOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  creditsInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scaleContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  scaleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scaleItem: {
    alignItems: 'center',
    width: '20%',
    marginBottom: 8,
  },
  scaleGrade: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  scalePoints: {
    fontSize: 12,
  },
  gradingSystemContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  gradingSystemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GPACalculatorScreen;