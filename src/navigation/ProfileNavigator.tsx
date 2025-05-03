import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from 'src/screens/HomeScreen'
import ProfileScreen from 'src/screens/ProfileScreen'
import NoteScreen from 'src/screens/NoteScreen'
const ProfileStack = createStackNavigator()

interface Props {
  onLogout: () => void,
}

export default function ProfileNavigator({ onLogout }: Props) {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: true }}>
      <ProfileStack.Screen name="Hồ sơ cá nhân">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </ProfileStack.Screen>
      <ProfileStack.Screen name="Ghi chú của tôi" component={NoteScreen} />
    </ProfileStack.Navigator>
  )
}
