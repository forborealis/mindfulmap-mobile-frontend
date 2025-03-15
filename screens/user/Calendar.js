import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMoodLogs } from '../../redux/actions/moodActions';

const moodImages = {
  relaxed: require('../../assets/relaxed.gif'),
  happy: require('../../assets/happy.gif'),
  fine: require('../../assets/fine.gif'),
  sad: require('../../assets/sad.gif'),
  anxious: require('../../assets/anxious.gif'),
  angry: require('../../assets/angry.gif'),
};

const Calendar = ({ navigation }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formattedMoodLogs, setFormattedMoodLogs] = useState({});
  
  // Redux state and dispatch
  const dispatch = useDispatch();
  const moodLogs = useSelector(state => state.moodLog.moodLogs || []);
  const userId = useSelector(state => state.auth.user?._id);
  
  // Fetch mood logs when component mounts
  useEffect(() => {
    if (userId) {
      dispatch(fetchMoodLogs(userId));
    }
  }, [dispatch, userId]);
  
  // Format mood logs by date for easy lookup
  useEffect(() => {
    if (moodLogs && moodLogs.length > 0) {
      const formattedLogs = {};
      moodLogs.forEach(log => {
        const logDate = new Date(log.date);
        const dateKey = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`;
        
        formattedLogs[dateKey] = {
          mood: log.mood.toLowerCase(), // Convert to lowercase to match image keys
          _id: log._id
        };
      });
      setFormattedMoodLogs(formattedLogs);
    }
  }, [moodLogs]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    const prevMonthDays = firstDayOfMonth;
    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
    
    // Previous month days
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const dayNumber = daysInPrevMonth - i;
      days.push(
        <View key={`prev-${dayNumber}`} style={styles.dayContainer}>
          <View style={styles.prevNextDayCircle}>
            {/* No plus sign for previous month days */}
          </View>
          <Text style={styles.dayTextPrevNext}>{dayNumber}</Text>
        </View>
      );
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const moodLog = formattedMoodLogs[dateString];
      
      const isToday = day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();
                    
      const isSelected = day === selectedDate.getDate() && 
                        month === selectedDate.getMonth() && 
                        year === selectedDate.getFullYear();
      
      const currentDate = new Date();
      const currentDay = currentDate.getDay(); // 0-Sun and 1-Mon
      const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
      const currentWeekMonday = new Date(currentDate);
      currentWeekMonday.setDate(currentDate.getDate() - daysToMonday);
      currentWeekMonday.setHours(0, 0, 0, 0);

      const currentWeekSunday = new Date(currentWeekMonday);
      currentWeekSunday.setDate(currentWeekMonday.getDate() + 6);
      currentWeekSunday.setHours(23, 59, 59, 999);

      const dateForComparison = new Date(year, month, day, 0, 0, 0, 0);
      const isInCurrentWeek = dateForComparison >= currentWeekMonday && dateForComparison <= currentDate;
      
      days.push(
        <TouchableOpacity 
          key={`current-${day}`}
          style={styles.dayContainer}
          onPress={() => {
            setSelectedDate(new Date(year, month, day));
            if (isInCurrentWeek && !moodLog) {
              navigation.navigate('MoodLogs', { selectedDate: new Date(year, month, day) });
            }
          }}
        >
          {moodLog ? (
            <View style={[
              styles.moodCircle
            ]}>
              <Image 
                source={moodImages[moodLog.mood]} 
                style={styles.moodImage} 
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={[
              styles.dayCircle,
              isToday && styles.todayCircleOutline,
              isSelected && !isToday && styles.selectedCircle
            ]}>
              {isInCurrentWeek ? (
                <Ionicons 
                  name="add" 
                  size={24} 
                  color={isToday ? "#4ecca3" : "#e1e1e1"} 
                />
              ) : null}
            </View>
          )}
          <Text style={[
            styles.dayText,
            isToday && styles.todayText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    // Next month days
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDayOfMonth + daysInMonth);
    
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(
        <View key={`next-${i}`} style={styles.dayContainer}>
          <View style={styles.prevNextDayCircle}>
            {/* No plus sign for next month days */}
          </View>
          <Text style={styles.dayTextPrevNext}>{i}</Text>
        </View>
      );
    }
    
    return days;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4ecca3" />
      
      {/* Month Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
            <Ionicons name="chevron-back" size={28} color="#555" />
          </TouchableOpacity>
          
          <Text style={styles.monthYearText}>
            {`${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
          </Text>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={28} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {/* Week Days */}
        <View style={styles.weekDaysRow}>
          {weekDays.map(day => (
            <Text key={day} style={styles.weekDayText}>{day}</Text>
          ))}
        </View>
        
        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {renderCalendarDays()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  monthYearText: {
    fontSize: 22,
    color: '#333',
    fontFamily: 'Nunito-Bold',
  },
  calendarContainer: {
    marginHorizontal: 15, // Adding left and right margins
    marginVertical: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  weekDaysRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
    fontFamily: 'Nunito-Bold',
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  dayContainer: {
    width: '14.28%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  prevNextDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodImage: {
    width: '90%',
    height: '90%',
  },
  addCircle: {
    borderWidth: 2,
    borderColor: '#ff6b6b',
    backgroundColor: 'white',
  },
  todayCircleOutline: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4ecca3', // Green outline for current date
  },
  selectedCircle: {
    backgroundColor: '#4ecca3',
  },
  dayText: {
    fontSize: 14,
    marginTop: 3,
    color: '#333',
    fontFamily: 'Nunito-Bold',
  },
  dayTextPrevNext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 3,
  },
  todayText: {
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#4ecca3',
    fontWeight: 'bold',
  },
  moodIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  moodCountContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 20,
    padding: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 3,
    fontFamily: 'Nunito-Bold',
  },
  navActiveText: {
    fontSize: 11,
    color: '#4ecca3',
    marginTop: 3,
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  addButton: {
    backgroundColor: '#ff6b6b',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Calendar;