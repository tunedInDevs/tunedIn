import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Search from './search';
import MyList from './my-list';

const Tab = createBottomTabNavigator();

export default function HomeLayout() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Search"
                component={Search}
                options={{ headerTitle: 'Search' }}
            />
            <Tab.Screen
                name="MyList"
                component={MyList}
                options={{ headerTitle: 'My List' }}
            />
        </Tab.Navigator>
    );
}
