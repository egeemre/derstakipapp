import React, { useState, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';

const FloatingActionButton = ({ onPress, icon = 'add', size = 32 }) => {
  const { theme } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    if (!isRotating) {
      setIsRotating(true);
      setIsPressed(true);
      
      // Rotate animation
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        // Reset rotation
        rotateAnim.setValue(0);
        setIsRotating(false);
        setIsPressed(false);
      });

      // Call the original onPress
      if (onPress) {
        onPress();
      }
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '270deg'],
  });

  return (
    <TouchableOpacity 
      style={[
        styles.fab, 
        { 
          backgroundColor: isPressed ? theme.colors.primary : '#000',
        }
      ]} 
      onPress={handlePress} 
      activeOpacity={0.8}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Icon 
          name={icon} 
          size={size} 
          color={isPressed ? theme.colors.background : '#fff'} 
          style={{ fontWeight: '900', fontSize: size + 4 }} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});

export default FloatingActionButton;
