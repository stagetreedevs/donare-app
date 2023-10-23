import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import AuthProvider from './src/contexts/Auth';
import LanguagesProvider from './src/contexts/Languages';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import FlashMessage from 'react-native-flash-message';

import Routes from './src/navigations/';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#F4AE38',
      accent: '#f1c40f',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <StatusBar backgroundColor="#F4AE38" barStyle="light-content" />
      <AuthProvider>
        <LanguagesProvider>
          <Routes style={{backgroundColor: '#FFF', flex: 1}} />
        </LanguagesProvider>
      </AuthProvider>
      <FlashMessage position="top" />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
