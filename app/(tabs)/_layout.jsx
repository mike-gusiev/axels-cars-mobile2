import { Tabs } from "expo-router";
import React from "react";

// import { TabBarIcon } from "../../components";

import { Colors } from "../../constants/Colors";

const TabLayout = () => {
  // const colorScheme = useColorScheme(); uncomment if you need to apply the theme change
  const colorScheme = "dark";
  const tabBarBackgroundColor =
    colorScheme === "dark" ? "rgba(36, 39, 46, 1))" : "white";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: colorScheme === "dark" ? "white" : "black",

        headerTitle: "",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
          borderTopColor: "black",
        },
      }}
    >
      <Tabs.Screen
        name="cars"
        options={{
          title: "Головна",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //     name={focused ? "home" : "home-outline"}
          //     color={color}
          //     style={undefined}
          //   />
          // ),
        }}
      />
      <Tabs.Screen
        name="сarWashing"
        options={{
          title: "Мийка",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //     name={focused ? "water" : "water-outline"}
          //     color={color}
          //     style={undefined}
          //   />
          // ),
        }}
      />
      <Tabs.Screen
        name="tyreFitting"
        options={{
          title: "Шиномонтаж",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "construct" : "construct-outline"}
              color={color}
              style={undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="serviceStations"
        options={{
          title: "СТО",
          // tabBarIcon: ({ color, focused }) => (
          //   <TabBarIcon
          //     name={focused ? "color-fill" : "color-fill-outline"}
          //     color={color}
          //     style={undefined}
          //   />
          // ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
