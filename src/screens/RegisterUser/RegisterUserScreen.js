import React, {useState, useRef, createRef, useContext} from 'react';
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import axios from 'axios';

//import Icon from 'react-native-ico-material-design';
import {RadioButton} from 'react-native-paper';
import {normalize} from '../../util/Normalize';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
//import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

import api, {BASE_URL} from '../../services/api';
import styles from './styles';
import {customToast} from '../../util/FlashMessage';

import {LanguagesContext} from '../../contexts/Languages';

export default function RegisterUserScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [image, setImage] = useState(null);
  const [type, setType] = useState('person');
  const [loading, setLoading] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [phoneNumber, setphoneNumber] = useState('');
  const phoneInput = useRef(null);
  const actionSheetRef = createRef();
  const {selectLanguage} = useContext(LanguagesContext);

  const openGallery = async () => {
    setLoadingPhoto(true);
    // customToast('Funcionalidade em desenvolvimento', 'info');
    let result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
    });

    if (!result.didCancel) {
      actionSheetRef.current?.setModalVisible(false);
      setImage(result.assets[0]);
      setLoadingPhoto(false);
    } else {
      actionSheetRef.current?.setModalVisible(false);
      setLoadingPhoto(false);
    }
  };

  const openCamera = async () => {
    setLoadingPhoto(true);
    const permissionResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (permissionResult.granted === false) {
      customToast(selectLanguage?.messagePermissionRejected, 'info');
      openCamera();
      actionSheetRef.current?.setModalVisible(false);
      return;
    }

    const result = await ImagePicker.launchCamera();

    if (!result.didCancel) {
      actionSheetRef.current?.setModalVisible(false);
      setImage(result.assets[0]);
      setLoadingPhoto(false);
      console.log(image);
    } else {
      actionSheetRef.current?.setModalVisible(false);
      setLoadingPhoto(false);
    }
  };

  async function handleRegisterUser() {
    // console.log("AQUI")
    setLoading(true);

    if (password === '') {
      customToast(selectLanguage?.messagePasswordEmpty, 'error');
      setLoading(false);
      return;
    } else if (password !== confirmationPassword) {
      customToast(selectLanguage?.messagePasswordDifferent, 'error');
      setLoading(false);
      return;
    } else if (password.length < 6) {
      customToast(selectLanguage?.messagePasswordLength, 'error');
      setLoading(false);
      return;
    } else {
      await api
        .post('auth/local/register', {
          username: name,
          email: email,
          password: password,
          phone: phoneNumber,
          type: type,
          blocked: false,
          document: '',
        })
        .then(async response => {
          // console.log(response.data);
          if (image?.uri) {
            const user = response.data?.user;
            const jwt = response.data?.jwt;

            let type = image.uri.substring(image.uri.lastIndexOf('.') + 1);

            let formData = new FormData();

            formData.append('files', {
              uri: image.uri,
              name: `media.${type}`,
              type: `image/${type}`,
            });

            formData.append('name', name);
            formData.append('refId', user.id);
            formData.append('ref', 'user');
            formData.append('field', 'photo');
            formData.append('source', 'users-permissions');

            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${jwt}`,
              },
              body: formData,
            };

            const res = await fetch(`${BASE_URL}/upload`, options);

            const data = await res.json();

            if (data[0]?.id) {
              setLoading(false);
              navigation.navigate('Login');
              customToast(selectLanguage?.messageSuccess, 'success');
            } else {
              setLoading(false);
              navigation.navigate('Login');
              customToast(
                selectLanguage?.messageUserRegisteredWithoutPhoto,
                'info',
              );
            }
          } else {
            setLoading(false);
            navigation.navigate('Login');
            customToast(selectLanguage?.messageSuccess, 'success');
          }
        })
        .catch(err => {
          console.log(
            err?.response?.data?.message[0]?.messages[0]?.message,
            'ERROR',
          );
          if (
            err?.response?.data?.message[0]?.messages[0]?.message ===
            'Email is already taken.'
          ) {
            customToast(selectLanguage?.messageEmailAlreadyRegistered, 'error');
            setLoading(false);
          } else {
            customToast(selectLanguage?.messageError, 'error');
            setLoading(false);
          }
        });
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView
        style={{width: '95%', marginTop: 20}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
          }}>
          <ActionSheet ref={actionSheetRef}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingBottom: 30,
                paddingTop: 30,
              }}>
              <TouchableOpacity
                onPress={() => {
                  openGallery();
                }}>
                <MaterialCommunityIcons
                  name="folder-image"
                  style={{
                    fontSize: normalize(30),
                    color: '#F4AE38',
                    marginLeft: 50,
                  }}
                />
              </TouchableOpacity>

              <Text
                onPress={() => {
                  openGallery();
                }}
                style={{marginLeft: 5, color: '#808080'}}>
                {selectLanguage?.gallery}
              </Text>

              <TouchableOpacity onPress={() => openCamera()}>
                <MaterialCommunityIcons
                  name="camera"
                  style={{
                    fontSize: normalize(28),
                    color: '#F4AE38',
                    marginLeft: 80,
                  }}
                />
              </TouchableOpacity>

              <Text
                onPress={() => openCamera()}
                style={{marginLeft: 5, color: '#808080'}}>
                {selectLanguage?.camera}
              </Text>
            </View>
          </ActionSheet>
        </View>

        <View style={styles.containerLogo}>
          <View
            style={{
              height: 120,
              width: 120,
              borderRadius: 60,
              borderWidth: 1,
              marginTop: 30,
              borderColor: '#F4AE38',
              alignItems: 'center',
            }}>
            {loadingPhoto ? (
              <ActivityIndicator
                size="large"
                color="#F4AE38"
                style={{marginVertical: '35%'}}
              />
            ) : image ? (
              <Image
                source={{uri: image?.uri}}
                style={{
                  width: 120,
                  height: 120,
                  borderWidth: 1,
                  borderRadius: 65,
                }}
                resizeMode={'cover'}
              />
            ) : (
              // <Icon
              //   name="user-shape"
              //   color='#f1f1f1'
              //   width={80}
              //   height={80}
              //   marginTop={12}
              //   color='#808080'
              // />
              <></>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current?.setModalVisible(true);
            }}>
            <MaterialCommunityIcons
              name="camera"
              style={{fontSize: 20, marginLeft: 70, color: '#F4AE38'}}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.name}
            autoCorrect={false}
            onChangeText={name => {
              setName(name);
            }}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.email}
            autoCorrect={false}
            onChangeText={email => {
              setEmail(email);
            }}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.password}
            autoCorrect={false}
            value={password}
            onChangeText={password => setPassword(password)}
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.confirmPassword}
            autoCorrect={false}
            value={confirmationPassword}
            onChangeText={confirmationPassword =>
              setConfirmationPassword(confirmationPassword)
            }
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc"
          />

          <PhoneInput
            ref={phoneInput}
            placeholder={selectLanguage?.phone}
            defaultValue={phoneNumber}
            defaultCode="BR"
            layout="first"
            withShadow
            autoFocus
            placeholderTextColor="#ccc"
            textInputProps={{
              maxLength: 14,
            }}
            containerStyle={styles.input}
            textContainerStyle={styles.phoneTextInput}
            onChangeFormattedText={phoneNumber => {
              setphoneNumber(phoneNumber);
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <RadioButton
              label={selectLanguage?.person}
              value="person"
              color="#F4AE38"
              status={type === 'person' ? 'checked' : 'unchecked'}
              onPress={() => setType('person')}
            />

            <Text style={styles.textType}>{selectLanguage?.person}</Text>

            <RadioButton
              label={selectLanguage?.instituition}
              value="company"
              color="#F4AE38"
              status={type === 'company' ? 'checked' : 'unchecked'}
              onPress={() => setType('company')}
            />

            <Text style={styles.textType}>{selectLanguage?.instituition}</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              handleRegisterUser();
            }}
            style={styles.buttonCreateAccount}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textCreateAccount}>
                {selectLanguage?.register}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.viewReturnLogin}>
            <Text
              style={{
                fontSize: 14,
                color: '#808080',
                marginTop: 30,
                paddingRight: 10,
              }}>
              {selectLanguage?.alreadyHaveAccount}
            </Text>

            <TouchableOpacity
              style={styles.buttonReturnLogin}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.textReturnLogin}>
                {selectLanguage?.enterTheAccount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
