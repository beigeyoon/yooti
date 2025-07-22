import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '@/screens/CalendarScreen';
import TodayScreen from '@/screens/TodayScreen';
import GroupsScreen from '@/screens/GroupsScreen';
import GroupScreen from '@/screens/GroupScreen';
import SomedaysScreen from '@/screens/SomedaysScreen';

export type RootStackParamList = {
  Calendar: undefined;
  Today: undefined;
  Groups: undefined;
  Group: { groupId: string };
  Somedays: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Today" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Today" component={TodayScreen} />
        <Stack.Screen name="Groups" component={GroupsScreen} />
        <Stack.Screen name="Somedays" component={SomedaysScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
