import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '@/screens/CalendarScreen';
import GroupsScreen from '@/screens/GroupsScreen';
import SomedaysScreen from '@/screens/SomedaysScreen';

export type RootStackParamList = {
  Calendar: undefined;
  Groups: undefined;
  Somedays: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Groups" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Groups" component={GroupsScreen} />
        <Stack.Screen name="Somedays" component={SomedaysScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
