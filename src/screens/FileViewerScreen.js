import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../localization/LanguageContext';

export default function FileViewerScreen({ navigation, route }) {
  const { t } = useLanguage();
  const { file } = route.params;
  const [selectedText, setSelectedText] = useState('');
  const [highlights, setHighlights] = useState([]);

  // Sample file content based on file name
  const getFileContent = (fileName) => {
    switch (fileName.toLowerCase()) {
      case 'biology':
        return `Biology Chapter 1: Introduction to Life

Life is a characteristic that distinguishes living organisms from non-living matter. All living things share certain fundamental characteristics:

1. Cellular Organization
All living things are composed of one or more cells. The cell is the basic unit of life. Single-celled organisms like bacteria exist as individual cells, while complex organisms like humans are made up of trillions of cells working together.

2. Metabolism
Living organisms carry out chemical reactions to maintain life. These reactions include breaking down nutrients for energy (catabolism) and building complex molecules (anabolism).

3. Growth and Development
All living things grow and develop according to specific instructions coded in their DNA. This growth involves an increase in size and often complexity.

4. Reproduction
Living organisms can produce offspring, either sexually or asexually, ensuring the continuation of their species.

5. Response to Environment
All living things can detect and respond to changes in their environment. This ability to respond is crucial for survival.

6. Homeostasis
Living organisms maintain stable internal conditions despite changes in their external environment.

7. Evolution
Over time, populations of living organisms change through the process of evolution, which allows them to adapt to their environment.`;

      case 'what is life?':
        return `What is Life? - A Philosophical Perspective

This fundamental question has puzzled philosophers and scientists for centuries. From a biological standpoint, life can be defined by several key characteristics, but the deeper question remains: what makes something truly "alive"?

The question of life touches on consciousness, purpose, and meaning. While we can describe the mechanisms of life, understanding its essence requires us to consider both scientific and philosophical perspectives.`;

      case 'math formulas':
        return `Essential Math Formulas

Algebra:
• Quadratic Formula: x = (-b ± √(b² - 4ac)) / 2a
• Slope of a line: m = (y₂ - y₁) / (x₂ - x₁)
• Distance Formula: d = √((x₂-x₁)² + (y₂-y₁)²)

Geometry:
• Area of circle: A = πr²
• Circumference: C = 2πr
• Area of triangle: A = ½bh
• Pythagorean Theorem: a² + b² = c²

Calculus:
• Derivative of xⁿ: d/dx(xⁿ) = nxⁿ⁻¹
• Integral of xⁿ: ∫xⁿdx = xⁿ⁺¹/(n+1) + C
• Chain Rule: d/dx[f(g(x))] = f'(g(x)) · g'(x)

Statistics:
• Mean: x̄ = Σx/n
• Standard Deviation: σ = √(Σ(x-μ)²/N)
• Probability: P(A) = Number of favorable outcomes / Total outcomes`;

      case 'physics formulas':
        return `Physics Formulas

Mechanics:
• Force: F = ma
• Kinetic Energy: KE = ½mv²
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

  const handleTextSelection = () => {
    Alert.alert(
      'Highlight Text',
      'Would you like to highlight the selected text?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Highlight',
          onPress: () => {
            if (selectedText) {
              setHighlights([...highlights, selectedText]);
              Alert.alert('Success', 'Text highlighted successfully!');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{file.name}</Text>
        <TouchableOpacity onPress={handleTextSelection}>
          <Icon name="color-palette-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* File info */}
      <View style={styles.fileInfo}>
        <Text style={styles.fileInfoText}>
          {file.size} • {file.pages} pages • {file.date}
        </Text>
      </View>

      {/* Document content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text 
          style={styles.documentText}
          selectable={true}
          onSelectionChange={(event) => {
            const { nativeEvent } = event;
            if (nativeEvent.selection) {
              const start = nativeEvent.selection.start;
              const end = nativeEvent.selection.end;
              const content = getFileContent(file.name);
              const selected = content.substring(start, end);
              setSelectedText(selected);
            }
          }}
        >
          {getFileContent(file.name)}
        </Text>
      </ScrollView>

      {/* Highlight panel */}
      {highlights.length > 0 && (
        <View style={styles.highlightPanel}>
          <Text style={styles.highlightTitle}>Highlights ({highlights.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightText} numberOfLines={2}>
                  {highlight.substring(0, 50)}...
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Bookmark</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="download-outline" size={20} color="#666" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  fileInfo: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
  },
  fileInfoText: {
    fontSize: 12,
    color: '#666',
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
    color: '#333',
    textAlign: 'justify',
  },
  highlightPanel: {
    backgroundColor: '#fff3cd',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  highlightItem: {
    backgroundColor: '#fff',
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0e68c',
    minWidth: 120,
    maxWidth: 150,
  },
  highlightText: {
    fontSize: 12,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    backgroundColor: '#f8f8f8',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});