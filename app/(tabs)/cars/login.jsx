import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
// import { useForm } from 'react-hook-form';
import { Link, Redirect, Stack, useRouter } from "expo-router";
import { useState } from "react";

// import {
//   ThemedView,
//   ThemedText,
//   HelloWave,
//   CustomInput,
// } from '../../../components';

// import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
// import { useAuth } from '../../../context/authContext';
// import { LinearGradient } from 'expo-linear-gradient';

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm();

  const [isSigningIn, setIsSigningIn] = useState(false);

  const { userLoggedIn } = useAuth();

  const router = useRouter();

  const onSubmit = async () => {
    const { email, password } = getValues();

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setError("email", {
          type: "manual",
          message: "Ел. пошта або пароль вказано не вірно",
        });
        setError("password", {
          type: "manual",
          message: "Ел. пошта або пароль вказано не вірно",
        });
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn ? (
        <Redirect href="/" />
      ) : (
        <>
          <LinearGradient
            colors={["#A3BDED", "#6991C7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.background}
          />
          <Stack.Screen
            options={{
              headerTitle: "",
              headerTransparent: true,
            }}
          />
          <ThemedView
            style={styles.container}
            lightColor={undefined}
            darkColor={undefined}
          >
            <ThemedText
              style={styles.textCenter}
              lightColor="white"
              type="title"
              darkColor={undefined}
            >
              Service Stations
            </ThemedText>

            <ThemedText
              style={styles.textCenter}
              lightColor="white"
              type="default"
              darkColor={undefined}
            >
              Будь-ласка, авторизуйтесь <HelloWave />
            </ThemedText>
            <View style={styles.inputContainer}>
              <CustomInput
                rules={{
                  required: "Ел. пошта обов'язкова",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Ел. пошта повинна бути дійсною",
                  },
                }}
                errors={errors}
                name="email"
                control={control}
                placeholder={"Ел. пошта"}
                keyboardType={"email-address"}
                style={undefined}
              />
              <CustomInput
                rules={{
                  required: "Пароль обов'язковий",
                  minLength: {
                    value: 6,
                    message: "Пароль повинен містити щонайменше 6 символів",
                  },
                }}
                errors={errors}
                name="password"
                control={control}
                placeholder={"Пароль"}
                secureTextEntry
                style={undefined}
              />
            </View>
            <TouchableOpacity
              disabled={isSigningIn}
              style={[
                styles.button,
                isSigningIn ? styles.disabledButton : null,
              ]}
              onPress={handleSubmit(onSubmit)}
            >
              <ThemedText
                lightColor="white"
                style={styles.textCenter}
                darkColor={undefined}
              >
                {isSigningIn ? "Вхід..." : "Увійти"}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signUp]}
              onPress={() => router.navigate("/register")}
            >
              <ThemedText
                lightColor="white"
                style={styles.textCenter}
                darkColor={undefined}
              >
                Зареєструватись
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <ThemedText
                lightColor="#7a7a7a"
                style={styles.textCenter}
                type="default"
                darkColor={undefined}
              >
                <Link href={"/(tabs)/serviceStations"}>Перейти до СТО</Link>
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </>
      )}
    </>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",

    backgroundColor: "rgba(36, 39, 46, 0.8))",
    padding: 20,
    width: "100%",
    flexDirection: "column",
    gap: 6,
  },
  textCenter: {
    textAlign: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    minWidth: 200,
    overflow: "hidden",
  },
  signUp: {
    backgroundColor: "#383b42",
  },
  button: {
    width: "100%",
    borderRadius: 12,
    fontWeight: 500,
    color: "#fff",
    fontSize: 14,
    padding: 13,
    backgroundColor: "#0371e2",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
});
