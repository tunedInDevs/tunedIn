import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Search from './Search';
import List from './List';

const Tab = createBottomTabNavigator();

export default function HomeLayout() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Search"
                component={Search}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="My List"
                component={List}
                options={{ headerShown: false }}            />
        </Tab.Navigator>
    );
}
