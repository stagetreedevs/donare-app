/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useContext, useRef, createRef} from 'react';
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
import Modal from 'react-native-modal';
import ActionSheet, {SheetManager} from 'react-native-actions-sheet';
import {AuthContext} from '../../contexts/Auth';
import {LanguagesContext} from '../../contexts/Languages';

import {RadioButton} from 'react-native-paper';
import {normalize} from '../../util/Normalize';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';

import styles from './styles';
import {customToast} from '../../util/FlashMessage';
import api from '../../services/api';
import {BASE_URL} from '../../services/api';
import UserShape from '../../../assets/usershape.png';
//import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

export default function ProfileScreen({navigation}) {
  const {
    user,
    UpdateUser,
    returnToken,
    updateToken,
    imageProfile,
    setImageProfile,
    HandleSetImageProfile,
    DeleteUser,
  } = useContext(AuthContext);
  const {selectLanguage} = useContext(LanguagesContext);
  const [userJson, setUserJson] = useState(JSON.parse(user));
  const [name, setName] = useState(userJson?.username);
  const [email, setEmail] = useState(userJson?.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [image, setImage] = useState(
    imageProfile
      ? imageProfile.formats?.small?.url
      : userJson?.photo?.formats?.small?.url,
  );
  const [type, setType] = useState(userJson?.type);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [error, setError] = useState(false);

  // const phone = userJson?.phone.replace('+55', '');
  // const phone = userJson?.phone.replace(/\D/g, '');

  const [phoneNumber, setphoneNumber] = useState(userJson?.phone);
  const phoneInput = useRef(null);

  const actionSheetRef = createRef();

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

  async function handleUpdateUser() {
    if (!loading) {
      // console.log("AQUI")
      setLoading(true);

      // if (password !== "") {
      //   customToast("Por favor, preencha o campo de senha!", 'error');
      //   setLoading(false);
      //   return;
      // }

      if (password !== '' && password !== confirmationPassword) {
        customToast(selectLanguage?.messagePasswordDifferent, 'error');
        setLoading(false);
        return;
      } else {
        // console.log("ELSE")
        let errorFlux = false;
        if (password !== '') {
          // console.log("PASSWORD")
          await api
            .post('/password/change', {
              identifier: email,
              password: currentPassword,
              newPassword: password,
            })
            .then(async response => {
              // if (response.data) {
              // console.log(response.data.user, "AQUI User")
              console.log(response.data.jwt, 'AQUI Token');
              await updateToken(response.data.jwt);
              await UpdateUser(response.data.user);
              setUserJson(response.data.user);
              setCurrentPassword('');
              setPassword('');
              setConfirmationPassword('');
              customToast(selectLanguage?.messagePasswordSuccess, 'success');
              errorFlux = false;
              // }
              // else {
              //   customToast("Senha atual incorreta", "error");
              // }
            })
            .catch(async error => {
              // console.log(error, "AQUI ERRO")
              errorFlux = true;
              customToast(selectLanguage?.messageCurrentPasswordError, 'error');
            })
            .finally(() => {
              setLoading(false);
            });
        }

        // console.log(errorFlux, "AQUI ERROFLUXO")

        if (!errorFlux) {
          // console.log(userJson.id, "ERRORFLUX")
          await api
            .put(`users/${userJson?.id}`, {
              username: name,
              phone: phoneNumber,
            })
            .then(async response => {
              // console.log(response.data, "AQUI")
              // console.log(response.data, "RESPONSE")

              if (response.status === 200) {
                // console.log(response.data, "********RESPONSE IF ERRORFLUX")
                UpdateUser(response.data);
                // get token by returnToken()
                const token = await returnToken();
                // console.log(token, "TOKENENENENENNE")

                if (image?.uri) {
                  // console.log(image, "IF IMAGE")
                  let type = image.uri.substring(
                    image.uri.lastIndexOf('.') + 1,
                  );
                  let formData = new FormData();

                  formData.append('files', {
                    uri: image.uri,
                    name: `media.${type}`,
                    type: `image/${type}`,
                  });

                  formData.append('refId', userJson.id);
                  formData.append('ref', 'user');
                  formData.append('field', 'photo');
                  formData.append('source', 'users-permissions');

                  // console.log(formData, "formData")

                  const options = {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  };

                  const res = await fetch(`${BASE_URL}/upload`, options);

                  const data = await res.json();
                  // console.log(data[0], "DATA")
                  if (data[0]?.id) {
                    await HandleSetImageProfile(data[0]);
                    setImageProfile(data[0]);
                    setLoading(false);
                    customToast(
                      selectLanguage?.messageProfileUpdated,
                      'success',
                    );
                  } else {
                    setLoading(false);
                    customToast(
                      selectLanguage?.messageErrorPhotoProfile,
                      'info',
                    );
                  }
                } else {
                  setLoading(false);
                  customToast(selectLanguage?.messageProfileUpdated, 'success');
                }
              } else {
                customToast(selectLanguage?.messageErrorProfile, 'error');
                setLoading(false);
              }
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
              customToast(selectLanguage?.messageErrorGeneral, 'error');
            });
        }
      }
    }
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView style={{width: '95%'}} showsVerticalScrollIndicator={false}>
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
              <TouchableOpacity onPress={() => openGallery()}>
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
                onPress={() => openGallery()}
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
              height: 160,
              width: 160,
              borderRadius: 80,
              borderWidth: 1,
              marginTop: 30,
              borderColor: '#F4AE38',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loadingPhoto ? (
              <ActivityIndicator
                size="large"
                color="#F4AE38"
                style={{marginVertical: '35%'}}
              />
            ) : image ? (
              <Image
                source={{uri: image.uri ? image.uri : BASE_URL + image}}
                style={{
                  width: 160,
                  height: 160,
                  borderWidth: 1,
                  borderColor: '#F4AE38',
                  borderRadius: 1000,
                }}
                resizeMode={'cover'}
              />
            ) : (
              <Image
                source={UserShape}
                style={{width: 155, height: 155, borderRadius: 1000}}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current?.setModalVisible(true);
            }}>
            <MaterialCommunityIcons
              name="camera"
              style={{
                fontSize: normalize(20),
                marginTop: 20,
                marginLeft: 100,
                color: '#F4AE38',
              }}
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
            value={name}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.email}
            autoCorrect={false}
            value={email}
            editable={false}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.passwordCurrent}
            autoCorrect={false}
            value={currentPassword}
            onChangeText={currentPassword =>
              setCurrentPassword(currentPassword)
            }
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.passwordNew}
            autoCorrect={false}
            value={password}
            onChangeText={password => setPassword(password)}
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.passwordNewConfirm}
            autoCorrect={false}
            value={confirmationPassword}
            onChangeText={confirmationPassword =>
              setConfirmationPassword(confirmationPassword)
            }
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc"
          />

          {/* <PhoneInput
            ref={phoneInput}
            placeholder='Telefone'
            defaultValue={phoneNumber}
            defaultCode={"BR"}
            layout="first"
            withShadow
            autoFocus
            textInputProps={{
              maxLength: 14,
            }}
            containerStyle={styles.input}
            textContainerStyle={styles.phoneTextInput}
            onChangeFormattedText={(phoneNumber) => { setphoneNumber(phoneNumber) }}
          /> */}

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.phone}
            autoCorrect={false}
            value={phoneNumber}
            onChangeText={phoneNumber => setphoneNumber(phoneNumber)}
            placeholderTextColor="#ccc"
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
            />

            <Text style={styles.textType}>{selectLanguage?.person}</Text>

            <RadioButton
              label={selectLanguage?.instituition}
              value="company"
              color="#F4AE38"
              status={type === 'company' ? 'checked' : 'unchecked'}
            />

            <Text style={styles.textType}>{selectLanguage?.instituition}</Text>
          </View>

          <TouchableOpacity
            onPress={() => handleUpdateUser()}
            style={styles.buttonCreateAccount}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textCreateAccount}>
                {selectLanguage?.save}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisible(true)}
            style={styles.buttonDeleteAccount}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textCreateAccount}>
                {selectLanguage?.delete}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        isVisible={visible}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.modal}>
          <Text style={styles.wait}>Tem Certeza?</Text>
          <Text style={styles.subWait}>essa ação é irreverssivel</Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.buttonConfirm}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.textCreateAccount}>
                  {selectLanguage?.cancel}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                DeleteUser();
                navigation.navigate('Login');
              }}
              style={styles.buttonDelete}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.textCreateAccount}>
                  {selectLanguage?.delete}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
