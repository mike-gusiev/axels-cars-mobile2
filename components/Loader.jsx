import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const Loader = () => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.text}>Завантажується...</Text>
    </SafeAreaView>
  );
};

export default Loader;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});
