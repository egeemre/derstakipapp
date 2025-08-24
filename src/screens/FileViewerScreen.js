import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

const FileViewerScreen = React.memo(({ navigation, route }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { file } = route.params;
  const [selectedText, setSelectedText] = useState('');
  const [highlights, setHighlights] = useState([]);

  // Memoize formatted date to avoid recalculation
  const formattedDate = useMemo(() => {
    try {
      const locale = language === 'tr' ? 'tr-TR' : 'en-US';
      return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(file.date);
    } catch (e) {
      return `${file.date.getDate()}.${file.date.getMonth() + 1}.${file.date.getFullYear()}`;
    }
  }, [file.date, language]);

  const getFileContent = (fileName) => {
    switch (fileName.toLowerCase()) {
      case 'biology':
        return `Biology Chapter 1: Introduction to Life

Life is a characteristic that distinguishes living organisms from non-living matter. All living things share certain fundamental characteristics:

1. Cellular Organization
All living things are composed of one or more cells. The cell is the basic unit of life and the smallest unit that can be considered truly alive.

2. Metabolism
Living organisms carry out chemical reactions to maintain life. This includes processes like respiration, digestion, and photosynthesis.

3. Growth and Development
Living things grow by increasing in size and often become more complex through development.

4. Reproduction
Living organisms have the ability to reproduce and pass genetic information to their offspring.

5. Response to Environment
Living things can sense and respond to changes in their environment through various mechanisms.

6. Homeostasis
Living organisms maintain internal balance despite changes in their external environment.

7. Evolution
Living things evolve over time through genetic changes that can be passed to future generations.

Classification of Life:
- Domain Bacteria: Single-celled prokaryotes
- Domain Archaea: Single-celled prokaryotes in extreme environments
- Domain Eukarya: Organisms with membrane-bound nuclei

The study of biology helps us understand the complexity and diversity of life on Earth, from the smallest bacteria to the largest mammals.`;

      case 'what is life?':
        return `What is Life? - A Philosophical and Scientific Perspective

This fundamental question has puzzled humanity for centuries. From a scientific standpoint, life can be defined by several key characteristics, but the boundaries remain surprisingly fuzzy.

Scientific Definition:
Life is typically characterized by:
• Organization (cellular structure)
• Metabolism (energy processing)
• Growth and reproduction
• Response to stimuli
• Adaptation through evolution

Philosophical Perspectives:
Different philosophical traditions have approached this question in various ways:

1. Vitalism: The idea that living things possess a special "life force"
2. Mechanism: Life as complex chemical and physical processes
3. Emergentism: Life as emergent properties from complex systems

Modern Challenges:
• Viruses: Are they alive or not?
• Artificial life: Can machines be considered alive?
• Extremophiles: Life in impossible conditions

The question "What is life?" continues to evolve as our understanding of biology, consciousness, and the universe expands.`;

      case 'math formulas':
        return `Essential Mathematical Formulas

Algebra:
• Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a
• Slope Formula: m = (y₂ - y₁) / (x₂ - x₁)
• Distance Formula: d = √((x₂ - x₁)² + (y₂ - y₁)²)

Geometry:
• Area of Circle: A = πr²
• Area of Triangle: A = ½bh
• Pythagorean Theorem: a² + b² = c²
• Volume of Sphere: V = (4/3)πr³

Trigonometry:
• sin²θ + cos²θ = 1
• Law of Sines: a/sin(A) = b/sin(B) = c/sin(C)
• Law of Cosines: c² = a² + b² - 2ab cos(C)

Calculus:
• Power Rule: d/dx(xⁿ) = nxⁿ⁻¹
• Product Rule: d/dx(uv) = u'v + uv'
• Chain Rule: d/dx(f(g(x))) = f'(g(x)) · g'(x)

Statistics:
• Mean: x̄ = (Σx) / n
• Standard Deviation: σ = √(Σ(x - x̄)² / n)
• Normal Distribution: f(x) = (1/σ√(2π)) · e^(-½((x-μ)/σ)²)`;

      case 'physics formulas':
        return `Essential Physics Formulas

Mechanics:
• Newton's Laws: F = ma
• Kinematic Equations: v = u + at, s = ut + ½at²
• Potential Energy: PE = mgh
• Momentum: p = mv
• Work: W = Fd cosθ

Waves and Sound:
• Wave equation: v = fλ
• Frequency: f = 1/T
• Speed of sound: v = 343 m/s (at 20°C)

Electricity:
• Ohm's Law: V = IR
• Power: P = VI = I²R = V²/R
• Coulomb's Law: F = kq₁q₂/r²

Thermodynamics:
• Ideal Gas Law: PV = nRT
• Heat: Q = mcΔT
• Efficiency: η = W/Q`;

      default:
        return `File content for "${fileName}" would be displayed here. This is a sample document viewer that supports text selection and highlighting.

You can select any text in this document and highlight it for future reference. The highlighting feature helps you mark important sections while studying.

This file viewer supports various document types and provides a clean reading experience optimized for mobile devices.`;
    }
  };

  // Memoize file content to avoid regeneration
  const fileContent = useMemo(() => {
    return getFileContent(file.name);
  }, [file.name]);

  // Use useCallback for event handlers
  const handleTextSelection = useCallback(() => {
    Alert.alert(
      'Highlight Text',
      'Would you like to highlight the selected text?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Highlight',
          onPress: () => {
            if (selectedText) {
              setHighlights(prev => [...prev, selectedText]);
              Alert.alert('Success', 'Text highlighted successfully!');
            }
          }
        }
      ]
    );
  }, [selectedText]);

  const handleSelectionChange = useCallback((event) => {
    const { nativeEvent } = event;
    if (nativeEvent.selection) {
      const start = nativeEvent.selection.start;
      const end = nativeEvent.selection.end;
      const selected = fileContent.substring(start, end);
      setSelectedText(selected);
    }
  }, [fileContent]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{file.name}</Text>
        <TouchableOpacity onPress={handleTextSelection}>
          <Icon name="brush-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* File info */}
      <View style={[styles.fileInfo, { backgroundColor: theme.colors.surfaceAlt }]}>
        <Text style={[styles.fileInfoText, { color: theme.colors.textSecondary }]}>
          {file.size} • {file.pages} {t.pages} • {formattedDate}
        </Text>
      </View>

      {/* Document content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text 
          style={[styles.documentText, { color: theme.colors.text }]}
          selectable={true}
          selectTextOnFocus={true}
          onSelectionChange={handleSelectionChange}
        >
          {fileContent}
        </Text>
      </ScrollView>

      {/* Add debug info for simulator testing */}
      {__DEV__ && (
        <View style={[styles.debugPanel, { backgroundColor: theme.colors.surfaceAlt, borderTopColor: theme.colors.border }]}>
          <Text style={[styles.debugText, { color: theme.colors.textSecondary }]}>
            Debug: Selected text length: {selectedText.length}
          </Text>
          {selectedText.length > 0 && (
            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: theme.colors.accent }]} 
              onPress={handleTextSelection}
            >
              <Text style={[styles.debugButtonText, { color: '#fff' }]}>Highlight Selected Text</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Highlight panel */}
      {highlights.length > 0 && (
        <View style={[styles.highlightPanel, { backgroundColor: theme.colors.accent + '20', borderTopColor: theme.colors.border }]}>
          <Text style={[styles.highlightTitle, { color: theme.colors.text }]}>Highlights ({highlights.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {highlights.map((highlight, index) => (
              <View key={index} style={[styles.highlightItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.highlightText, { color: theme.colors.text }]} numberOfLines={2}>
                  {highlight.substring(0, 50)}...
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action buttons */}
      <View style={[styles.actionButtons, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.surfaceAlt }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Bookmark</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="download-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.textSecondary }]}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  fileInfo: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  fileInfoText: {
    fontSize: 12,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  documentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  highlightPanel: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  highlightItem: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 120,
    maxWidth: 150,
  },
  highlightText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  debugPanel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 4,
  },
  debugButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  debugButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FileViewerScreen;