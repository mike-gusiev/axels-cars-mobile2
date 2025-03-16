import { Stack } from "expo-router/stack";

// import { AuthProvider } from '../context/authContext';
// import Toast from "react-native-toast-message";
// import { toastConfig } from "../toastConfig";

const AppLayout = () => {
  return (
    // <AuthProvider>
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerTitle: "",
        }}
      />
    </Stack>
    // <Toast config={toastConfig()} />
    // </AuthProvider>
  );
};
export default AppLayout;
