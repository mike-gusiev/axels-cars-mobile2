import { useColorScheme } from 'react-native';

import { Colors } from '../constants/Colors';

export function useThemeColor(props, colorName) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props && props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (colorName) {
    return Colors[theme][colorName];
  } else {
    return Colors[theme]
  }
}
