import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Redirect, Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from 'expo-linear-gradient';

// import {
//   AddCarForm,
//   CarCard,
//   ThemedText,
//   ThemedView,
// } from "../../../components";

// import { doSignOut } from "../../../firebase/auth";
// import { useAuth } from "../../../context/authContext";
// import { deleteCarFromUser, getUserCars } from "../../../firebase/firestore";
// import BookingCard from "../../../components/BookingCard";
// import useFetchUserBookings from "../../../hooks/useFetchUserBookings";

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [formHidden, setFormHidden] = useState(true);
  const [carsIsLoading, setCarIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // const { userLoggedIn, currentUser } = useAuth();

  return <Text>fewfwefewffwefwefs</Text>;

  // const { activeBookings, completedBookings, fetchUserBookings } =
  //   useFetchUserBookings(currentUser);

  // const fetchCars = async () => {
  //   if (currentUser) {
  //     setCarIsLoading(true);

  //     try {
  //       const userCars = await getUserCars(currentUser.uid);
  //       setCars(userCars);
  //       setCarIsLoading(false);
  //     } catch (error) {
  //       setCarIsLoading(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   fetchUserBookings();
  // }, [currentUser, fetchUserBookings]);

  // useEffect(() => {
  //   fetchCars();
  // }, [currentUser]);

  // const onRefresh = () => {
  //   fetchCars().catch((e) => console.error(e.message));
  //   fetchUserBookings().catch((e) => console.error(e.message));
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     onRefresh();
  //   }, [])
  // );

  // const deleteCar = async (car) => {
  //   if (currentUser) {
  //     try {
  //       const userCars = await deleteCarFromUser(currentUser.uid, car);
  //       setCars(userCars);
  //     } catch (error) {
  //       console.error("Error deleting car: ", error.message);
  //     }
  //   }
  // };

  // const toggleForm = () => {
  //   setFormHidden((prev) => !prev);
  // };

  // return (
  //   <KeyboardAvoidingView
  //     behavior={Platform.OS === "ios" ? "padding" : "height"}
  //     style={{ flex: 1 }}
  //     keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 76}
  //   >
  //     {!userLoggedIn ? (
  //       <Redirect href="/cars/login" />
  //     ) : (
  //       <SafeAreaProvider>
  //         <Stack.Screen
  //           options={{
  //             headerShown: false,
  //           }}
  //         />
  //         <ThemedView
  //           style={styles.container}
  //           lightColor={undefined}
  //           darkColor={undefined}
  //         >
  //           {/* <LinearGradient
  //             colors={['#A3BDED', '#6991C7']}
  //             start={{ x: 0, y: 0 }}
  //             end={{ x: 1, y: 0 }}
  //             style={styles.background}
  //           /> */}
  //           <SafeAreaView style={styles.myCarsWrapper}>
  //             <View style={styles.myCarsHeader}>
  //               <TouchableOpacity
  //                 style={styles.signOutButton}
  //                 onPress={doSignOut}
  //               >
  //                 <ThemedText
  //                   style={styles.signOutButtonText}
  //                   lightColor={undefined}
  //                   darkColor={undefined}
  //                 >
  //                   Вийти
  //                 </ThemedText>
  //               </TouchableOpacity>
  //               <ThemedText
  //                 style={undefined}
  //                 lightColor={"#fff"}
  //                 darkColor={"#fff"}
  //               >
  //                 {currentUser?.email}
  //               </ThemedText>
  //             </View>
  //             <ScrollView
  //               refreshControl={
  //                 <RefreshControl
  //                   refreshing={refreshing}
  //                   onRefresh={onRefresh}
  //                 />
  //               }
  //               style={styles.mainContainer}
  //             >
  //               <View>
  //                 <View style={styles.containerTitle}>
  //                   <ThemedText
  //                     lightColor="white"
  //                     type="title"
  //                     style={undefined}
  //                     darkColor={undefined}
  //                   >
  //                     {cars.length > 0 ? "Додані авто" : "Додай авто"}
  //                   </ThemedText>
  //                   <TouchableOpacity
  //                     style={styles.addButton}
  //                     onPress={toggleForm}
  //                   >
  //                     <Text style={styles.addButtonText}>
  //                       {formHidden ? "Додати" : "Приховати"}{" "}
  //                     </Text>
  //                   </TouchableOpacity>
  //                 </View>

  //                 {!formHidden && (
  //                   <AddCarForm
  //                     setFormHidden={setFormHidden}
  //                     setCars={setCars}
  //                   />
  //                 )}
  //                 {carsIsLoading ? (
  //                   <View style={styles.loaderWrapper}>
  //                     <ThemedText
  //                       lightColor="black"
  //                       type="default"
  //                       style={undefined}
  //                       darkColor={"black"}
  //                     >
  //                       Завантаження...
  //                     </ThemedText>
  //                   </View>
  //                 ) : (
  //                   <View style={styles.myCarsList}>
  //                     {cars.map((car) => (
  //                       <CarCard car={car} key={car.id} deleteCar={deleteCar} />
  //                     ))}
  //                   </View>
  //                 )}
  //               </View>
  //               {activeBookings.length > 0 && (
  //                 <View>
  //                   <ThemedText
  //                     lightColor="white"
  //                     type="title"
  //                     style={styles.title}
  //                     darkColor={undefined}
  //                   >
  //                     Активні бронювання
  //                   </ThemedText>
  //                   <View>
  //                     {activeBookings.map((booking) => (
  //                       <BookingCard
  //                         key={booking.id}
  //                         fetchUserBookings={fetchUserBookings}
  //                         item={booking}
  //                         done={false}
  //                       ></BookingCard>
  //                     ))}
  //                   </View>
  //                 </View>
  //               )}
  //               {completedBookings.length > 0 && (
  //                 <View>
  //                   <ThemedText
  //                     lightColor="white"
  //                     type="title"
  //                     style={styles.title}
  //                     darkColor={undefined}
  //                   >
  //                     Виконані бронювання
  //                   </ThemedText>

  //                   <View>
  //                     {completedBookings.map((booking) => (
  //                       <BookingCard
  //                         key={booking.id}
  //                         fetchUserBookings={fetchUserBookings}
  //                         item={booking}
  //                         done={true}
  //                       ></BookingCard>
  //                     ))}
  //                   </View>
  //                 </View>
  //               )}
  //             </ScrollView>
  //           </SafeAreaView>
  //         </ThemedView>
  //       </SafeAreaProvider>
  //     )}
  //   </KeyboardAvoidingView>
  // );
};

export default CarsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,

    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  title: {
    marginVertical: 16,
  },
  myCarsWrapper: {
    flex: 1,
    gap: 6,
  },
  signOutButton: {
    backgroundColor: "transparent",
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  signOutButtonText: {
    color: "#1976d2",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  myCarsHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  mainContainer: {
    gap: 6,
    flex: 1,
    paddingHorizontal: 10,
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#383b42",
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
  },
  myCarsList: {
    flex: 1,
    flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
  },
  loaderWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
