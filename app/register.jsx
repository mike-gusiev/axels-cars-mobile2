import { StyleSheet, View, TouchableOpacity } from "react-native";
// import { useForm } from 'react-hook-form';
import { Link, Redirect, Stack, useRouter } from "expo-router";
import { useState } from "react";

// import { ThemedText, ThemedView, HelloWave, CustomInput } from '../components';

// import { useAuth } from "../context/authContext";
// import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
// import { LinearGradient } from "expo-linear-gradient";

const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({});

  const [isSigningIn, setIsSigningIn] = useState(false);

  const { userLoggedIn } = useAuth();

  const router = useRouter();

  const onSubmit = async () => {
    const { email, password, lastName, firstName } = getValues();

    if (!isSigningIn) {
      setIsSigningIn(true);

      try {
        await doCreateUserWithEmailAndPassword(
          email,
          password,
          firstName,
          lastName
        );
      } catch (error) {
        setError("email", {
          type: "manual",
          message: "Ел. пошта недійсна або вже зайнята",
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
            options={{ headerTitle: "", headerTransparent: true }}
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
              Будь-ласка, авторизуйтесь
              <HelloWave />
            </ThemedText>
            <View style={styles.inputContainer}>
              <View style={styles.inputContainerFullName}>
                <CustomInput
                  rules={{
                    required: "Ім'я обов'язкове",
                  }}
                  errors={errors}
                  name="firstName"
                  control={control}
                  placeholder={"Ім'я"}
                  style={undefined}
                />
                <CustomInput
                  rules={{
                    required: "Прізвище обов'язкове",
                  }}
                  errors={errors}
                  name="lastName"
                  control={control}
                  placeholder={"Прізвище"}
                  style={undefined}
                />
              </View>
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
                keyboardType="email-address"
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
              <CustomInput
                rules={{
                  required: "Ці паролі не збігаються. Спробуйте ще раз",
                  minLength: {
                    value: 6,
                    message: "Пароль повинен містити щонайменше 6 символів",
                  },
                  validate: {
                    matchesPreviousPassword: (value) => {
                      const { password } = getValues();
                      return value === password || "Паролі повинні збігатися";
                    },
                  },
                }}
                errors={errors}
                name="confirmPassword"
                control={control}
                placeholder={"Підтвердіть пароль"}
                secureTextEntry
                style={undefined}
              />
            </View>
            <TouchableOpacity
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
                {isSigningIn ? "Вхід..." : "Зареєструватись"}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, ...styles.signUp }}
              onPress={() => router.navigate("/cars/login")}
            >
              <ThemedText
                lightColor="white"
                style={styles.textCenter}
                darkColor={undefined}
              >
                Увійти
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <ThemedText
                lightColor="#7a7a7a"
                style={styles.textCenter}
                type="default"
                darkColor={undefined}
              >
                <Link href={"/(tabs)/serviceStations"}>перейти до СТО</Link>{" "}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </>
      )}
    </>
  );
};
export default RegisterPage;

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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textCenter: {
    textAlign: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 12,
    minWidth: 200,
    overflow: "hidden",
  },
  inputContainerFullName: {
    display: "flex",
    flexDirection: "row",
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
  disabledButton: { backgroundColor: "gray" },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
});
