import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

import ThemedText from './ThemedText';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

const HelloWave = () => {
  const rotationAnimation = useSharedValue(0);
    
  rotationAnimation.value = withRepeat(
    withSequence(
      withTiming(25, { duration: 150 }),
      withTiming(0, { duration: 150 })
    ),
    4
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText
        style={styles.text}
        lightColor={undefined}
        darkColor={undefined}
      >
        👋
      </ThemedText>
    </Animated.View>
  );
};

export default HelloWave;

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
