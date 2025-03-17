import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { useThemeColor } from '../hooks/useThemeColor';

const ThemedView = ({ style, lightColor, darkColor, ...otherProps }) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
};

ThemedView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  lightColor: PropTypes.string,
  darkColor: PropTypes.string,
};
export default ThemedView;
