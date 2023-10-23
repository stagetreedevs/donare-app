/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useContext, useEffect} from 'react';
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
} from 'react-native';
//import * as Location from 'expo-location';
import Location from 'react-native-geolocation-service';
import CountryFlag from 'react-native-country-flag';
import styles from './styles';
import {AuthContext} from '../../contexts/Auth';
import {LanguagesContext} from '../../contexts/Languages';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const {SiginIn, VerifyToken, loading, user} = useContext(AuthContext);
  const {setLatitude, setLongitude} = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const {language, setLanguage, selectLanguage, getLanguage, changeLanguage} =
    useContext(LanguagesContext);

  useEffect(() => {
    getLanguage();
    handleGetLocation();
    handleAppStateChange('active');
  }, []);

  useEffect(() => {
    VerifyToken().then(() => {
      if (user) {
        navigation.navigate('Home', {
          user: JSON.parse(user),
        });
      }
    });
  }, [user, navigation]);

  useEffect(() => {
    let focusListener = navigation.addListener('didFocus', async () => {
      const user = await VerifyToken();
      if (user) {
        navigation.navigate('Home', {
          user: JSON.parse(user),
        });
      }
    });
  }, [navigation]);
  const handleAppStateChange = async nextAppState => {
    if (nextAppState == 'active') {
      request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
        .then(async result => {
          if (result == RESULTS.GRANTED) {
          }
        })
        .catch(erro => {
          console.log('erro: ', erro);
        });
    }
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        Alert.alert(
          selectLanguage?.permissionToLocation,
          selectLanguage?.permissionToLocationMessage,
          [
            {
              text: 'Tentar novamente',
              onPress: () => {
                requestLocationPermission();
              },
            },
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('MapLocation', {
                  goHome: undefined,
                }),
            },
          ],
          'default',
        );
        return;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  handleGetLocation = async () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Location.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            //setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  function handleChangeLanguage(countryCode) {
    changeLanguage(countryCode);
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView
        style={{width: '95%', marginTop: 20}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.containerLogo}>
          <Image
            style={styles.logo}
            source={require('../../../assets/logoDonare.png')}
          />
        </View>

        <View style={styles.container}>
          <View style={[styles.input, {flexDirection: 'row'}]}>
            <TextInput
              style={{flex: 1, fontSize: 17}}
              placeholder={selectLanguage?.email}
              placeholderTextColor="gray"
              autoCorrect={false}
              value={email}
              onChangeText={email => setEmail(email)}
            />
            <AntDesign name="user" size={24} style={styles.icon} />
          </View>

          <View style={[styles.input, {flexDirection: 'row'}]}>
            <TextInput
              style={{flex: 1, fontSize: 17}}
              placeholder={selectLanguage?.password}
              placeholderTextColor="gray"
              autoCorrect={false}
              value={password}
              onChangeText={password => setPassword(password)}
              secureTextEntry={hidePassword}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              <Feather
                name={!hidePassword == true ? 'eye' : 'eye-off'}
                size={24}
                style={{
                  color: 'black',
                }}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.buttonSubmit}
            onPress={() => {
              SiginIn(email, password);
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.textSubmit}>{selectLanguage?.login}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgot_button}>
              {selectLanguage?.forgotPassword}
            </Text>
          </TouchableOpacity>

          <View style={styles.viewRegister}>
            <Text
              style={{
                fontSize: 14,
                color: '#808080',
                marginTop: 10,
                paddingRight: 10,
              }}>
              {selectLanguage?.notHaveAccount}
            </Text>

            <TouchableOpacity
              style={styles.buttonRegister}
              onPress={() => navigation.navigate('RegisterUser')}>
              <Text style={styles.textRegister}>
                {selectLanguage?.createAccount}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.viewRegister, {marginTop: 20}]}>
            <TouchableOpacity onPress={() => handleChangeLanguage('pt-BR')}>
              <CountryFlag isoCode="br" size={25} style={styles.flagsCountry} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChangeLanguage('en-US')}>
              <CountryFlag isoCode="us" size={25} style={styles.flagsCountry} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChangeLanguage('es-ES')}>
              <CountryFlag isoCode="es" size={25} style={styles.flagsCountry} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChangeLanguage('it-IT')}>
              <CountryFlag isoCode="it" size={25} style={styles.flagsCountry} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChangeLanguage('de-DE')}>
              <CountryFlag isoCode="de" size={25} style={styles.flagsCountry} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
