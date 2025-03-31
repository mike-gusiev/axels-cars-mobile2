// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import PropTypes from 'prop-types';

const TabBarIcon = ({ style, ...rest }) => {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
};
TabBarIcon.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  name: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default TabBarIcon;
