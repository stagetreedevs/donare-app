import React, {useEffect, useState, useContext} from 'react';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {FAB} from 'react-native-paper';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import {AuthContext} from '../../contexts/Auth';
import {normalize} from '../../util';
import {LanguagesContext} from '../../contexts/Languages';

export default function MapLocation({navigation}) {
  const {latitude, longitude, handleLocation} = useContext(AuthContext);
  const {selectLanguage} = useContext(LanguagesContext);

  const [pin, setPin] = useState({
    title: 'Minha localização',
    latitude: latitude || -23.56498,
    longitude: longitude || -46.6564,
    goHome: navigation?.state?.params?.goHome,
  });
  const handleNavigate = async pin => {
    console.log('navigate', pin);
    handleLocation(pin);

    pin.goHome === undefined
      ? navigation.navigate('Login')
      : pin.goHome !== undefined && pin.goHome
      ? navigation.navigate('Home')
      : navigation.navigate('DonationRegister');
  };
  //console.log( navigation?.state?.params?.goHome, "AQIIIIIIII")

  console.log(latitude, longitude, 'LOCATION');

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        onPress={e => {
          console.log(e.nativeEvent.coordinate, 'Press');
          setPin({
            ...pin,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            goHome: pin?.goHome,
          });
        }}
        initialRegion={{
          latitude: pin?.latitude,
          longitude: pin?.longitude,
          latitudeDelta: 2.0,
          longitudeDelta: 2.0,
        }}>
        <Circle
          key={(pin.longitude + pin?.longitude).toString()}
          center={{
            latitude: pin?.latitude,
            longitude: pin?.longitude,
          }}
          radius={100000}
          strokeWidth={1}
          strokeColor={'#1a66ff'}
          fillColor={'rgba(230,238,255,0.5)'}
        />
        <Marker draggable coordinate={pin} pinColor="#F4AE38" />
      </MapView>
      <Text
        style={[
          styles.fab,
          {
            marginBottom: 76,
            backgroundColor: '#fff',
            color: '#F00',
            padding: 6,
            fontSize: normalize(14),
            textAlign: 'center',
          },
        ]}>
        Clique no mapa para alterar a localização, isso irá alterar sua
        localização para ver os anúncios
      </Text>
      <FAB
        style={[styles.fab]}
        small
        label={`${selectLanguage?.confirmLocation}`}
        color="#FFF"
        icon="pin"
        onPress={() => {
          // console.log(pin, "PIN");
          Alert.alert(
            'Confirmar localização',
            'Deseja confirmar a localização? Lembre-se que a localização será usada para ver os anúncios',
            [
              {
                text: 'Não',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Sim',
                onPress: () => {
                  handleNavigate(pin);
                },
              },
            ],
            {cancelable: false},
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  fab: {
    backgroundColor: '#F4AE38',
    position: 'absolute',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 0,
  },
});
