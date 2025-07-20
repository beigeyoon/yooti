import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import GlobalHeader from './src/components/GlobalHeader';
import CalendarScreen from './src/screens/CalendarScreen';
import SomedaysScreen from './src/screens/SomedaysScreen';
import { useTimeStore } from './src/store/itemStore';

export default function App() {
  const { load, deleteAllItems, items } = useTimeStore();
  const [currentScreen, setCurrentScreen] = useState<'calendar' | 'today' | 'form' | 'somedays'>(
    'calendar',
  );
  const [screenTitle, setScreenTitle] = useState<string>('Yooti');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null); // 수정할 아이템

  useEffect(() => {
    load(); // 앱 시작 시 저장된 데이터 로드
  }, [load]);

  const handleBack = () => {
    if (currentScreen === 'today') {
      setCurrentScreen('calendar');
      setScreenTitle('Yooti');
      setSelectedDate(null);
    } else if (currentScreen === 'form') {
      setCurrentScreen('calendar');
      setScreenTitle('Yooti');
      setEditingItem(null);
    } else if (currentScreen === 'somedays') {
      setCurrentScreen('calendar');
      setScreenTitle('Yooti');
    }
  };

  const handleNavigateToToday = (date: string) => {
    setSelectedDate(date);
    setCurrentScreen('today');
    setScreenTitle('Today');
  };

  const handleNavigateToForm = (presetDate?: string) => {
    setCurrentScreen('form');
    setScreenTitle('새 아이템 만들기');
    setEditingItem(null);
    // presetDate가 있으면 selectedDate로 설정
    if (presetDate) {
      setSelectedDate(presetDate);
    }
  };

  const handleNavigateToEditForm = (item: any) => {
    setEditingItem(item);
    setCurrentScreen('form');
    setScreenTitle('아이템 수정');
  };

  const handleBackToCalendar = () => {
    setCurrentScreen('calendar');
    setScreenTitle('Yooti');
    setSelectedDate(null);
    setEditingItem(null);
  };

  const handleNavigateToSomedays = () => {
    setCurrentScreen('somedays');
    setScreenTitle('언젠가');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalHeader
        title={screenTitle}
        onBack={currentScreen !== 'calendar' ? handleBack : undefined}
        onNavigateToSomeday={handleNavigateToSomedays}
      />
      {currentScreen === 'somedays' ? (
        <SomedaysScreen onEditItem={handleNavigateToEditForm} />
      ) : (
        <CalendarScreen
          currentScreen={currentScreen}
          selectedDate={selectedDate}
          onNavigateToToday={handleNavigateToToday}
          onNavigateToForm={handleNavigateToForm}
          onNavigateToEditForm={handleNavigateToEditForm}
          onBackToCalendar={handleBackToCalendar}
          editingItem={editingItem}
        />
      )}

      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}
