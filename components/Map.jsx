import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Text,
  View,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import PropTypes from "prop-types";
import { Chevron } from "react-native-shapes";
import MapView, { Marker } from "react-native-maps";
import AntDesign from "@expo/vector-icons/AntDesign";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";

import useUserLocation from "../hooks/useUserLocation";
// import MarkerDetails from "./MarkerDetails";
// import BookingModal from "./BookingModal";
// import SearchFilter from "./SearchFilter";
// import CalloutPopup from "./CalloutPopup";
// import MarkerItem from "./MarkerItem";
// import Tags from "./Tags";
import { sortByDistance } from "../helpers/sortByDistance";
import { Image } from "react-native";

const SNAP_POINTS = {
  large: ["5%", "90%"],
  medium: ["5%", "70%"],
};

const Map = ({ markers, city, setCity }) => {
  const { userLocation, citiesList } = useUserLocation();
  const bottomSheetModalRef = useRef(null);
  const scrollViewRef = useRef(null);
  const markerRefs = useRef({});

  const [uniqueTags, setUniqueTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [snapIndex, setSnapIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [myLocation, setMyLocation] = useState(undefined);
  const [visibleMarkers, setVisibleMarkers] = useState(10);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [sortedMarkers, setSortedMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [snapPoints, setSnapPoints] = useState(SNAP_POINTS.large);
  const [isBookModalVisible, setIsBookModalVisible] = useState(false);
  const [isPinDetailsVisible, setIsPinDetailsVisible] = useState(false);
  const [location, setLocation] = useState({
    latitude: 50.45,
    longitude: 30.51,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  });

  const [isMapCentered, setIsMapCentered] = useState(true);
  const mapRef = useRef(null);

  const centerOnUserLocation = () => {
    if (myLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: myLocation.latitude,
          longitude: myLocation.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        },
        500
      );
      setIsMapCentered(true);
    }
  };

  const handleRegionChangeComplete = (region) => {
    if (!myLocation) return;

    const latDiff = Math.abs(region.latitude - myLocation.latitude);
    const lonDiff = Math.abs(region.longitude - myLocation.longitude);

    setIsMapCentered(latDiff < 0.01 && lonDiff < 0.01);
  };

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const pickerSelectStyles = useMemo(() => getStyles(isDarkMode), [isDarkMode]);

  useEffect(() => {
    if (!city) return;
    bottomSheetModalRef.current?.present();
  }, [city]);

  useEffect(() => {
    if (
      city &&
      userLocation &&
      markers &&
      markers[0]?.city === userLocation?.name
    ) {
      const sortedData = sortByDistance(markers, userLocation.position);
      setSortedMarkers(sortedData);
    } else {
      setSortedMarkers(markers);
    }
  }, [city, markers, userLocation, setCity]);

  useEffect(() => {
    if (userLocation) {
      setLocation(userLocation.position);
      setMyLocation(userLocation.position);
    }
  }, [userLocation]);

  useEffect(() => {
    setUniqueTags(extractUniqueTags(markers));
  }, [markers]);

  useEffect(() => {
    setUniqueTags(extractUniqueTags(markers));
  }, [markers]);

  useEffect(() => {
    if (markers.length === 0) {
      setIsLoading(true);
      return;
    }

    if (searchQuery.length === 0 && filteredMarkers[0]?.city !== city) {
      setFilteredMarkers(markers);
    }

    setIsLoading(false);
  }, [markers, searchQuery, city]);

  const handleBackButton = () => {
    setIsPinDetailsVisible(false);
    setSnapPoints(SNAP_POINTS.large);
  };

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (yOffset + layoutHeight >= contentHeight - 500) {
      setVisibleMarkers((prevState) => prevState + 10);
    }
    if (yOffset > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const handleScrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleNavigate = (lat, lng) => {
    const coordinates = lat + "," + lng;
    const url = Platform.select({
      ios: `maps:0,0?q=${coordinates}`,
      android: `geo:0,0?q=${coordinates}`,
    });

    Linking.openURL(url);
  };

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      bottomSheetModalRef.current?.present();
      setSnapIndex(0);
    }
  }, []);

  const handleChangeCity = (value) => {
    if (!citiesList || citiesList.length === 0) return;

    const currentCity = citiesList.find(({ name }) => name === value);

    if (!currentCity || currentCity.name === city) return;
    setIsLoading(true);
    setUniqueTags(extractUniqueTags(markers));

    const location = {
      latitude: currentCity.latitude,
      longitude: currentCity.longitude,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    };
    setCity(value);
    setLocation(location);
  };

  const handlePressListItem = (marker) => {
    bottomSheetModalRef.current?.close();
    setLocation({
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    });
    const markerToOpen = markerRefs.current[marker.id];
    setTimeout(() => {
      markerToOpen.showCallout();
    }, 500);
  };

  const handleCalloutClick = (marker) => {
    setIsPinDetailsVisible(true);
    bottomSheetModalRef.current?.present();
    setSnapPoints(SNAP_POINTS.medium);
    setCurrentMarker(marker);
    setSnapIndex(1);
  };

  const handlePressOnPhoneNumber = () => {
    Linking.openURL("tel:+380671234567");
  };

  const extractUniqueTags = useCallback(
    (markers) => {
      const allTags = markers.map((marker) => marker.tags).flat();

      const uniqueTags = [...new Set(allTags)];

      return uniqueTags;
    },
    [markers]
  );

  const renderFilteredMarkers = useMemo(
    () =>
      filteredMarkers.slice(0, visibleMarkers).map((marker) => (
        <View></View>
        // <MarkerItem
        //   key={marker.id}
        //   marker={marker}
        //   handlePressListItem={handlePressListItem}
        //   setIsBookModalVisible={setIsBookModalVisible}
        //   handlePressOnPhoneNumber={handlePressOnPhoneNumber}
        //   setCurrentMarker={setCurrentMarker}
        // />
      )),
    [filteredMarkers, visibleMarkers]
  );

  const searchResultTitle = useMemo(() => {
    const hasQuery = searchQuery.length > 0;
    const hasResult = filteredMarkers?.length > 0;

    if (isLoading) {
      return (
        <Text style={[styles.lightTitle, styles.titleMargin, styles.container]}>
          Завантажуємо сервіси...
        </Text>
      );
    }

    if (hasQuery && hasResult) {
      return (
        <Text style={[styles.lightTitle, styles.titleMargin, styles.container]}>
          За запитом "{searchQuery}" {filteredMarkers.length} результатів у м.
          {city}
        </Text>
      );
    }

    if (hasQuery && !hasResult) {
      return (
        <Text style={[styles.lightTitle, styles.titleMargin, styles.container]}>
          За запитом "{searchQuery}" нічого не знайдено
        </Text>
      );
    }

    if (hasResult && !isLoading) {
      return (
        <Text style={[styles.lightTitle, styles.titleMargin, styles.container]}>
          {filteredMarkers.length} результатів у м.{city}
        </Text>
      );
    }
  }, [filteredMarkers, searchQuery, isLoading]);

  if (!city) return;

  // return <View></View>;

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.safeAreaView}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={location}
            zoomEnabled={true}
            onRegionChangeComplete={handleRegionChangeComplete}
          >
            {myLocation && (
              <Marker
                coordinate={{
                  latitude: myLocation.latitude || 0,
                  longitude: myLocation.longitude || 0,
                }}
                title="Ви тут"
              >
                <Image
                  source={require("../assets/images/location-green.png")}
                  style={styles.markerIcon}
                />
              </Marker>
            )}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker?.latitude || 0,
                  longitude: marker?.longitude || 0,
                }}
                ref={(m) => {
                  markerRefs.current[marker.id] = m;
                }}
              >
                {/* <CalloutPopup
                  handleCalloutClick={handleCalloutClick}
                  marker={marker}
                /> */}
              </Marker>
            ))}
          </MapView>
          {!isMapCentered && myLocation && (
            <View style={styles.centerButtonContainer}>
              <Pressable
                style={styles.centerButton}
                onPress={centerOnUserLocation}
              >
                <AntDesign name="enviroment" size={24} color="white" />
              </Pressable>
            </View>
          )}
          <BottomSheetModal
            index={snapIndex}
            snapPoints={snapPoints}
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            backgroundStyle={styles.modalBackground}
            handleIndicatorStyle={styles.handleIndicator}
          >
            <BottomSheetView style={styles.contentContainer}>
              {isPinDetailsVisible ? (
                <View></View>
              ) : (
                // <MarkerDetails
                //   currentMarker={currentMarker}
                //   handleNavigate={handleNavigate}
                //   handleBackButton={handleBackButton}
                //   setIsBookModalVisible={setIsBookModalVisible}
                //   handlePressOnPhoneNumber={handlePressOnPhoneNumber}
                // />
                <>
                  {showScrollToTop && (
                    <View style={styles.buttonView}>
                      <Pressable
                        style={styles.scrollButton}
                        onPress={handleScrollToTop}
                      >
                        <View style={styles.scrollButtonWrapper}>
                          <AntDesign name="caretup" size={24} color="white" />
                        </View>
                      </Pressable>
                    </View>
                  )}
                  <ScrollView
                    ref={scrollViewRef}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={{ width: "100%" }}
                  >
                    <View style={[styles.flexbox, styles.cityBox]}>
                      <Text style={styles.lightText}>Місто</Text>
                      {/* <RNPickerSelect
                        value={city}
                        style={{
                          ...pickerSelectStyles,
                          iconContainer: {
                            top: 15,
                            right: 15,
                          },
                        }}
                        placeholder={{
                          label: "Оберіть місто...",
                          value: "",
                          color: "#9EA0A4",
                        }}
                        onValueChange={handleChangeCity}
                        items={citiesList.map((item) => ({
                          label: item.label,
                          value: item.name,
                        }))}
                        Icon={() => {
                          return <Chevron size={1.5} color="#000000" />;
                        }}
                        useNativeAndroidPickerStyle={false}
                      /> */}
                    </View>
                    {/* <SearchFilter
                      sortedMarkers={sortedMarkers}
                      selectedTags={selectedTags}
                      searchQuery={searchQuery}
                      setIsLoading={setIsLoading}
                      setSearchQuery={(query) =>
                        setSearchQuery(query.trimLeft())
                      }
                      setFilteredMarkers={setFilteredMarkers}
                    /> */}
                    {/* <Tags
                      city={city}
                      tags={uniqueTags}
                      markers={markers}
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                      setFilteredMarkers={setFilteredMarkers}
                    /> */}
                    {searchResultTitle}

                    {isLoading ? (
                      <ActivityIndicator size="large" color="#ffffff" />
                    ) : (
                      renderFilteredMarkers
                    )}
                  </ScrollView>
                </>
              )}
            </BottomSheetView>
          </BottomSheetModal>
          {/* <BookingModal
            setIsBookModalVisible={setIsBookModalVisible}
            isBookModalVisible={isBookModalVisible}
            currentMarker={currentMarker}
          /> */}
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 10,
  },
  safeAreaView: {
    flex: 1,
    overflow: "hidden",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: -1,
  },
  modalBackground: {
    backgroundColor: "#00000080",
    borderRadius: 0,
  },
  scrollButton: {
    width: 50,
    height: 50,
    display: "block",
    color: "#fff",
    backgroundColor: "#00000080",
  },
  scrollButtonWrapper: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  pathButton: {
    color: "#ffffff",
    borderColor: "#000000",
    borderWidth: 1,
    fontSize: 14,
    padding: 10,
    marginTop: 5,
    fontWeight: 500,
  },
  bookButton: {
    backgroundColor: "#000000",
    height: 50,
    color: "#ffffff",
    borderWidth: 1,
    marginTop: 5,
    fontSize: 14,
    fontWeight: 500,
  },
  center: {
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  handleIndicator: {
    backgroundColor: "#ffffff",
    marginVertical: 8,
    width: 40,
  },
  buttonView: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    right: 10,
    zIndex: 999,
  },
  flexbox: {
    paddingHorizontal: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  cityBox: {
    width: "100%",
    marginTop: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  lightTitle: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
  },
  lightText: {
    fontSize: 18,
    color: "#ffffff",
  },
  titleMargin: {
    marginBottom: 20,
  },
  markerIcon: {
    width: 30,
    height: 42,
  },
  centerButtonContainer: {
    position: "absolute",
    bottom: 100,
    right: 10,
    zIndex: 10,
  },
  centerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
});
function getStyles(isDarkMode) {
  return StyleSheet.create({
    inputIOS: {
      width: 200,
      fontSize: 18,
      paddingVertical: 8,
      paddingHorizontal: 4,
      borderRadius: 4,
      color: "#000000",
      paddingRight: 30,
      backgroundColor: "#ffffff80",
    },
    inputAndroid: {
      width: 200,
      fontSize: 18,
      paddingVertical: 4,
      paddingHorizontal: 10,
      color: "#000000",
      paddingRight: 30,
      backgroundColor: "#ffffff80",
    },
    viewContainer: {
      backgroundColor: "#ffffff80",
    },
    modalViewMiddle: {
      backgroundColor: "#ffffff80",
    },
    modalViewBottom: isDarkMode ? { backgroundColor: "#333333" } : {},
  });
}

Map.propTypes = {
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      position: PropTypes.shape({
        lat: PropTypes.number,
        lon: PropTypes.number,
      }),
      popUp: PropTypes.node,
    })
  ),
  city: PropTypes.string,
  setCity: PropTypes.func,
};

export default Map;
