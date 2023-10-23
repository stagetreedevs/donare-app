import React, {createContext, useState} from 'react';
import api, {getToken} from '../../services/api';
//import { customToast } from '../../util/FlashMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logged, setLogged] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageProfile, setImageProfile] = useState(null);

  async function VerifyToken() {
    console.log('VerifyToken');
    setLoading(true);

    const token = await AsyncStorage.getItem('@Donare:token');

    if (token) {
      const user = await AsyncStorage.getItem('@Donare:user');
      const imageProfile = await AsyncStorage.getItem('@Donare:imageProfile');
      console.log('imageProfile', imageProfile);

      await getToken(token);
      setUser(user);
      if (imageProfile) {
        setImageProfile(JSON.parse(imageProfile));
      }
      setLogged(true);
      setLoading(false);
      return user;
    }

    setLoading(false);
    return () => {};
  }

  async function HandleSetImageProfile(image) {
    console.log(image, 'HandleSetImageProfile');
    setImageProfile(image);
    await AsyncStorage.setItem('@Donare:imageProfile', JSON.stringify(image));
  }

  async function updateToken(token) {
    console.log(token, 'updateToken');
    if (token) {
      await AsyncStorage.setItem('@Donare:token', token);
      await setToken(token);
      await getToken(token);
    }
  }

  async function returnToken() {
    const token = await AsyncStorage.getItem('@Donare:token');
    console.log('returnToken' + token);
    return token;
  }

  const handleLocation = pin => {
    // console.log(
    //   '================================================================================================================================',
    // );
    // console.log('handleLocation', pin);
    // console.log('latitude', pin?.latitude);
    // console.log('longitude', pin?.longitude);
    // console.log(
    //   '================================================================================================================================',
    // );

    if (pin.latitude && pin.longitude) {
      setLatitude(pin.latitude);
      setLongitude(pin.longitude);
    }
  };
  async function SiginIn(email, password) {
    //console.log("SiginIn")
    setLoading(true);
    await api
      .post('auth/local/', {
        identifier: email.toLowerCase(),
        password: password,
      })
      .then(async response => {
        // console.log('response', response.data)
        // console.log(response.data, "response")
        await AsyncStorage.setItem('@Donare:token', response?.data?.jwt);
        await AsyncStorage.setItem(
          '@Donare:user',
          JSON.stringify(response?.data?.user),
        );
        // console.log("\n\n====response====", response?.data?.user, "====response====\n\n")
        // await getToken(response.data.jwt)
        // setEmail('');
        // setPassword('');
        // navigation.navigate('Home', {
        //   user: response.data.user
        // });
        // console.log(navigation, "SUCESSO")
        console.log('as');
        setUser(response?.data?.user);
        setLoading(false);
      })
      .catch(err => {
        console.log(err, 'ERRO');
        setError(err.response.data.error);
        setLogged(false);
        setLoading(false);
        //customToast("Usuário ou senha incorretos", "error");
      });
  }

  async function UpdateUser(user) {
    // console.log(user, "***user***")
    if (user?.username) {
      await AsyncStorage.setItem('@Donare:user', JSON.stringify(user));
      setUser(JSON.stringify(user));
    }
  }
  async function SiginOut() {
    console.log('SiginOut');
    await getToken(null);
    setUser(null);
    setToken(null);
    setError(null);
    setLogged(false);
    setLatitude(null);
    setLongitude(null);
    setImageProfile(null);
    await AsyncStorage.clear();
  }
  async function DeleteUser() {
    // console.log(user, "***user***")
    const me = JSON.parse(user);
    if (me?.id) {
      try {
        await api.delete(`users/${me.id}`);
        await getToken(null);
        setUser(null);
        setToken(null);
        setError(null);
        setLogged(false);
        setLatitude(null);
        setLongitude(null);
        setImageProfile(null);
        await AsyncStorage.clear();
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logged,
        setLogged,
        SiginIn,
        VerifyToken,
        UpdateUser,
        setLatitude,
        latitude,
        setLongitude,
        longitude,
        returnToken,
        updateToken,
        imageProfile,
        setImageProfile,
        SiginOut,
        HandleSetImageProfile,
        handleLocation,
        DeleteUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
