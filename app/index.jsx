import { Redirect } from 'expo-router';

const Home = () => {
  return <Redirect href={'/(tabs)/cars'} />;
};

export default Home;
