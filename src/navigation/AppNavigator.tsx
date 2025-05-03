import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer'
import { View } from 'react-native'

import HomeNavigator from './HomeNavigator'
import HistoryNavigator from './HistoryNavigator'
import RankingNavigator from './RankingNavigator'
import ProfileScreen from 'src/screens/ProfileScreen'
import { HeaderRight } from 'src/components/HeaderRight'
import ProfileNavigator from 'src/navigation/ProfileNavigator'
const Drawer = createDrawerNavigator()

interface Props {
  onLogout: () => void
}

interface LogoutDrawerItemProps {
  onLogout: () => void
  props: DrawerContentComponentProps
}

const LogoutDrawerItem = ({ onLogout, props }: LogoutDrawerItemProps) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerItemList {...props} />
      <DrawerItem label="Đăng xuất" onPress={onLogout} />
    </View>
  )
}

export default function AppNavigator({ onLogout }: Props) {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Trang chủ"
        screenOptions={{
          headerTitle: '',
          headerRight: () => <HeaderRight />,
          headerRightContainerStyle: {
            paddingRight: 15
          }
        }}
        drawerContent={(props) => <LogoutDrawerItem onLogout={onLogout} props={props} />}
      >
        <Drawer.Screen name="Trang chủ" component={HomeNavigator} />
        <Drawer.Screen name="Bảng xếp hạng" component={RankingNavigator} />
        <Drawer.Screen name="Lịch sử" component={HistoryNavigator} />
        <Drawer.Screen name="Hồ sơ" component={() => <ProfileNavigator onLogout={onLogout} />} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}
