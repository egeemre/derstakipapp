import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';

export default function SummariesScreen({ navigation }) {
  const { t } = useLanguage();
  const [summaries] = useState([
    { id: 1, title: 'Biology Chapter 1 Summary', document: 'biology.pdf', date: '2026-09-10', pages: 2 },
    { id: 2, title: 'Math Formulas Summary', document: 'math_formulas.pdf', date: '2026-08-25', pages: 1 },
    { id: 3, title: 'Physics Laws Summary', document: 'physics_formulas.pdf', date: '2026-07-10', pages: 1 },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.summaries}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Summaries List */}
      <ScrollView style={styles.summariesContainer} showsVerticalScrollIndicator={false}>
        {summaries.map((summary) => (
          <TouchableOpacity key={summary.id} style={styles.summaryItem}>
            <View style={styles.summaryIcon}>
              <Icon name="reader" size={24} color="#000" />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>{summary.title}</Text>
              <Text style={styles.summaryDocument}>From: {summary.document}</Text>
              <View style={styles.summaryMeta}>
                <Text style={styles.summaryDate}>{summary.date}</Text>
                <Text style={styles.summaryPages}>{summary.pages} {t.pages}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Icon name="eye-outline" size={20} color="#000" />
            </TouchableOpacity>
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
  summariesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryIcon: {
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  summaryDocument: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  summaryMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryDate: {
    fontSize: 12,
    color: '#999',
  },
  summaryPages: {
    fontSize: 12,
    color: '#666',
  },
  viewButton: {
    padding: 8,
  },
});