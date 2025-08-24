import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useLanguage } from '../localization/LanguageContext';
import { useTheme } from '../theme/ThemeContext';

const ToDoListScreen = ({ navigation }) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Study Biology Chapter 5',
      description: 'Review cell division and mitosis',
      dueDate: new Date(2025, 7, 26), // August 26, 2025 (month is 0-indexed)
      priority: 'high',
      completed: false,
      createdAt: new Date(2025, 7, 24),
    },
    {
      id: 2,
      title: 'Math Assignment',
      description: 'Complete exercises 1-15',
      dueDate: new Date(2025, 7, 25), // August 25, 2025
      priority: 'medium',
      completed: false,
      createdAt: new Date(2025, 7, 23),
    },
    {
      id: 3,
      title: 'Prepare for Chemistry Quiz',
      description: 'Study periodic table and chemical bonds',
      dueDate: new Date(2025, 7, 27), // August 27, 2025
      priority: 'high',
      completed: false,
      createdAt: new Date(2025, 7, 24),
    },
    {
      id: 4,
      title: 'English Essay Draft',
      description: 'Write first draft of literature analysis',
      dueDate: new Date(2025, 7, 30), // August 30, 2025
      priority: 'medium',
      completed: false,
      createdAt: new Date(2025, 7, 24),
    },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedTime, setSelectedTime] = useState({ hour: 9, minute: 0 });
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [tempSelectedTime, setTempSelectedTime] = useState({ hour: 9, minute: 0 });

  const priorityColors = {
    high: '#FF4757',
    medium: '#FFA502',
    low: '#26de81',
  };

  const getTaskStatus = (task) => {
    if (task.completed) return 'completed';
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const taskDate = new Date(task.dueDate);
    
    if (taskDate < today) return 'overdue';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#26de81';
      case 'overdue': return '#FF4757';
      case 'pending': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return t.completed;
      case 'overdue': return t.overdue;
      case 'pending': return t.pending;
      default: return t.pending;
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const taskDate = new Date(date);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return t.todayTasks || 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Use dd/mm/yyyy format for all languages except English
    if (language === 'en') {
      return taskDate.toLocaleDateString('en-US'); // mm/dd/yyyy for English
    } else {
      return taskDate.toLocaleDateString('en-GB'); // dd/mm/yyyy for all others
    }
  };

  const openModal = useCallback((task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskTitle(task.title);
      setTaskDescription(task.description || '');
      setTaskPriority(task.priority);
      setTaskDueDate(new Date(task.dueDate));
      setSelectedTime({ 
        hour: new Date(task.dueDate).getHours(), 
        minute: new Date(task.dueDate).getMinutes() 
      });
    } else {
      setEditingTask(null);
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      const defaultDate = new Date();
      defaultDate.setHours(9, 0, 0, 0);
      setTaskDueDate(defaultDate);
      setSelectedTime({ hour: 9, minute: 0 });
    }
    setModalVisible(true);
  }, []);

  const openDatePicker = () => {
    // Set temporary values to current task date/time
    setTempSelectedDate(new Date(taskDueDate));
    setTempSelectedTime({...selectedTime});
    setShowDatePicker(true);
  };

  const confirmDateSelection = () => {
    // Apply temporary selections to actual task
    const finalDate = new Date(tempSelectedDate);
    finalDate.setHours(tempSelectedTime.hour, tempSelectedTime.minute, 0, 0);
    setTaskDueDate(finalDate);
    setSelectedTime({...tempSelectedTime});
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    // Reset temporary selections and close
    setShowDatePicker(false);
  };

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate(new Date());
  }, []);

  const saveTask = useCallback(() => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      dueDate: taskDueDate,
      priority: taskPriority,
      completed: editingTask ? editingTask.completed : false,
      createdAt: editingTask ? editingTask.createdAt : new Date(),
    };

    if (editingTask) {
      setTasks(prev => prev.map(task => task.id === editingTask.id ? newTask : task));
    } else {
      setTasks(prev => [...prev, newTask]);
    }

    closeModal();
  }, [taskTitle, taskDescription, taskDueDate, taskPriority, editingTask, closeModal]);

  const toggleTaskCompletion = useCallback((taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId) => {
    Alert.alert(
      t.deleteTask,
      'Are you sure you want to delete this task?',
      [
        { text: t.cancel, style: 'cancel' },
        { 
          text: t.delete, 
          style: 'destructive',
          onPress: () => setTasks(prev => prev.filter(task => task.id !== taskId))
        },
      ]
    );
  }, [t]);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setTaskDueDate(selectedDate);
    }
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  const renderTask = (task) => {
    const status = getTaskStatus(task);
    const statusColor = getStatusColor(status);
    const statusText = getStatusText(status);

    return (
      <View key={task.id} style={[styles.taskCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.taskHeader}>
          <TouchableOpacity
            style={[styles.checkboxContainer, { borderColor: priorityColors[task.priority] }]}
            onPress={() => toggleTaskCompletion(task.id)}
          >
            {task.completed && (
              <Icon name="checkmark" size={16} color={priorityColors[task.priority]} />
            )}
          </TouchableOpacity>
          
          <View style={styles.taskContent}>
            <Text style={[
              styles.taskTitle, 
              { color: theme.colors.text },
              task.completed && styles.completedText
            ]}>
              {task.title}
            </Text>
            
            {task.description && (
              <Text style={[styles.taskDescription, { color: theme.colors.textSecondary }]}>
                {task.description}
              </Text>
            )}
            
            <View style={styles.taskMeta}>
              <View style={[styles.priorityBadge, { backgroundColor: priorityColors[task.priority] + '20' }]}>
                <Text style={[styles.priorityText, { color: priorityColors[task.priority] }]}>
                  {t[task.priority]}
                </Text>
              </View>
              
              <Text style={[styles.dueDateText, { color: theme.colors.textSecondary }]}>
                {formatDate(task.dueDate)}
              </Text>
              
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>
          
          <View style={styles.taskActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openModal(task)}
            >
              <Icon name="create-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => deleteTask(task.id)}
            >
              <Icon name="trash-outline" size={20} color="#FF4757" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCalendar = () => {
    const today = new Date();
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Create array of days
    const days = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    const isSelectedDate = (day) => {
      if (!day) return false;
      const date = new Date(currentYear, currentMonth, day);
      return tempSelectedDate.toDateString() === date.toDateString();
    };
    
    const isPastDate = (day) => {
      if (!day) return false;
      const date = new Date(currentYear, currentMonth, day);
      return date < today.setHours(0, 0, 0, 0);
    };

    const goToPreviousMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const goToNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };
    
    return (
      <View style={styles.calendar}>
        {/* Month Navigation Header */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <Icon name="chevron-back" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.monthHeader}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Days of week header */}
        <View style={styles.weekHeader}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.weekDay}>{day}</Text>
          ))}
        </View>
        
        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !day && styles.emptyDay,
                isSelectedDate(day) && styles.selectedCalendarDay,
                isPastDate(day) && styles.pastDay
              ]}
              onPress={() => {
                if (day && !isPastDate(day)) {
                  const selectedDate = new Date(currentYear, currentMonth, day);
                  setTempSelectedDate(selectedDate);
                }
              }}
              disabled={!day || isPastDate(day)}
            >
              {day && (
                <Text style={[
                  styles.calendarDayText,
                  isSelectedDate(day) && styles.selectedCalendarDayText,
                  isPastDate(day) && styles.pastDayText
                ]}>
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Picker */}
        <View style={styles.timePickerContainer}>
          <Text style={styles.timePickerTitle}>Select Time</Text>
          <View style={styles.timePicker}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Hour</Text>
              <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                {Array.from({length: 24}, (_, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.timeOption,
                      tempSelectedTime.hour === i && styles.selectedTimeOption
                    ]}
                    onPress={() => setTempSelectedTime({...tempSelectedTime, hour: i})}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      tempSelectedTime.hour === i && styles.selectedTimeOptionText
                    ]}>
                      {i.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Minute</Text>
              <ScrollView style={styles.timeScroll} showsVerticalScrollIndicator={false}>
                {Array.from({length: 12}, (_, i) => i * 5).map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timeOption,
                      tempSelectedTime.minute === minute && styles.selectedTimeOption
                    ]}
                    onPress={() => setTempSelectedTime({...tempSelectedTime, minute: minute})}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      tempSelectedTime.minute === minute && styles.selectedTimeOptionText
                    ]}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle={theme.name === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t.toDoList}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tasks List */}
      <ScrollView style={styles.tasksContainer} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="checkbox-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.colors.textSecondary }]}>{t.noTasks}</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>{t.noTasksSubtext}</Text>
            <TouchableOpacity
              style={[styles.addTaskButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => openModal()}
            >
              <Text style={[styles.addTaskButtonText, { color: theme.colors.background }]}>{t.addTask}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tasksList}>
            {tasks.map(renderTask)}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Task Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <SafeAreaView style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={[styles.modalCancel, { color: theme.colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                {editingTask ? 'Edit Task' : 'New Task'}
              </Text>
              <TouchableOpacity onPress={saveTask}>
                <Text style={[styles.modalSave, { color: theme.colors.primary }]}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              {/* Task Title */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Task Title *
                </Text>
                <TextInput
                  style={[styles.textInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={taskTitle}
                  onChangeText={setTaskTitle}
                  placeholder="Enter task title..."
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              {/* Task Description */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Description
                </Text>
                <TextInput
                  style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                  placeholder="Add description (optional)..."
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Due Date */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Due Date
                </Text>
                <TouchableOpacity
                  style={[styles.dateButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={openDatePicker}
                >
                  <Text style={[styles.dateText, { color: theme.colors.text }]}>
                    {taskDueDate.toLocaleDateString()} at {selectedTime.hour.toString().padStart(2, '0')}:{selectedTime.minute.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Priority */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Priority Level
                </Text>
                <Text style={[styles.priorityHelper, { color: theme.colors.textSecondary }]}>
                  Choose how urgent this task is
                </Text>
                <View style={styles.priorityContainer}>
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      { borderColor: priorityColors.high },
                      taskPriority === 'high' && { backgroundColor: priorityColors.high + '20', borderWidth: 2 }
                    ]}
                    onPress={() => setTaskPriority('high')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      { color: priorityColors.high },
                      taskPriority === 'high' && { fontWeight: 'bold' }
                    ]}>
                      High
                    </Text>
                    <Text style={[styles.prioritySubtext, { color: priorityColors.high }]}>
                      Urgent
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      { borderColor: priorityColors.medium },
                      taskPriority === 'medium' && { backgroundColor: priorityColors.medium + '20', borderWidth: 2 }
                    ]}
                    onPress={() => setTaskPriority('medium')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      { color: priorityColors.medium },
                      taskPriority === 'medium' && { fontWeight: 'bold' }
                    ]}>
                      Medium
                    </Text>
                    <Text style={[styles.prioritySubtext, { color: priorityColors.medium }]}>
                      Normal
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.priorityOption,
                      { borderColor: priorityColors.low },
                      taskPriority === 'low' && { backgroundColor: priorityColors.low + '20', borderWidth: 2 }
                    ]}
                    onPress={() => setTaskPriority('low')}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      { color: priorityColors.low },
                      taskPriority === 'low' && { fontWeight: 'bold' }
                    ]}>
                      Low
                    </Text>
                    <Text style={[styles.prioritySubtext, { color: priorityColors.low }]}>
                      Flexible
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>

        {/* Custom Date Picker */}
        {showDatePicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.datePickerModal}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerHeader}>
                  <TouchableOpacity onPress={cancelDateSelection}>
                    <Text style={styles.datePickerCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.datePickerTitle}>Select Date</Text>
                  <TouchableOpacity onPress={confirmDateSelection}>
                    <Text style={styles.datePickerDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView style={styles.datePickerContent}>
                  {/* Quick Options */}
                  <Text style={styles.sectionTitle}>Quick Options</Text>
                  <View style={styles.quickOptionsContainer}>
                    {[0, 1, 2, 3, 7, 14, 30].map((days) => {
                      const date = new Date();
                      date.setDate(date.getDate() + days);
                      const isSelected = tempSelectedDate.toDateString() === date.toDateString();
                      
                      return (
                        <TouchableOpacity
                          key={days}
                          style={[
                            styles.quickOption,
                            isSelected && styles.selectedQuickOption
                          ]}
                          onPress={() => {
                            setTempSelectedDate(date);
                          }}
                        >
                          <Text style={[
                            styles.quickOptionText,
                            isSelected && styles.selectedQuickOptionText
                          ]}>
                            {days === 0 ? 'Today' : 
                             days === 1 ? 'Tomorrow' : 
                             days === 7 ? 'Next Week' : 
                             days === 14 ? '2 Weeks' : 
                             days === 30 ? '1 Month' : 
                             `${days} days`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Calendar */}
                  <Text style={styles.sectionTitle}>Choose Specific Date</Text>
                  <View style={styles.calendarContainer}>
                    {renderCalendar()}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </Modal>

      {/* Floating Action Button */}
      {tasks.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => openModal()}
        >
          <Icon name="add" size={28} color={theme.colors.background} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tasksList: {
    paddingBottom: 100,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  addTaskButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addTaskButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 12,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  prioritySubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  priorityHelper: {
    fontSize: 12,
    marginBottom: 8,
  },
  dateChevron: {
    marginLeft: 'auto',
  },
  datePickerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#FF4757',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerDone: {
    fontSize: 16,
    color: '#26de81',
  },
  datePickerContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  quickOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  quickOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedQuickOption: {
    backgroundColor: '#26de81',
    borderColor: '#26de81',
  },
  quickOptionText: {
    fontSize: 12,
    color: '#666',
  },
  selectedQuickOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  calendarContainer: {
    marginTop: 16,
  },
  calendar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  calendarDay: {
    width: '13.8%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#f9f9f9',
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  selectedCalendarDay: {
    backgroundColor: '#26de81',
  },
  pastDay: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedCalendarDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pastDayText: {
    color: '#bbb',
  },
  timePickerContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },
  timePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  timeScroll: {
    height: 120,
    width: 60,
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#f0f0f0',
  },
  selectedTimeOption: {
    backgroundColor: '#26de81',
  },
  timeOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  selectedTimeOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  wheelContainer: {
    position: 'relative',
    height: 120,
    width: 60,
  },
  wheelPicker: {
    flex: 1,
  },
  wheelContent: {
    paddingVertical: 40,
  },
  wheelItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedWheelItem: {
    backgroundColor: '#26de81',
    borderRadius: 8,
  },
  wheelItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedWheelItemText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  wheelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelSelection: {
    height: 40,
    width: '100%',
    backgroundColor: 'rgba(38, 222, 129, 0.2)',
    borderRadius: 8,
  },
});

export default ToDoListScreen;