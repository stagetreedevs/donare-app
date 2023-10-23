import React, { useEffect, useState, useContext, createRef } from 'react';
import {
  TextInput,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  PermissionsAndroid
} from 'react-native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { Picker } from '@react-native-picker/picker';
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import useForceUpdate from 'use-force-update';
import { customToast } from '../../util/FlashMessage';
import styles from './styles';
import { normalize } from "../../util/Normalize"
import { Gallery } from 'react-native-gallery-view';
import api from '../../services/api'
import { BASE_URL } from '../../services/api';
import axios from 'axios';
import { AuthContext } from '../../contexts/Auth';
import { LanguagesContext } from '../../contexts/Languages';
import CurrencyInput from 'react-native-currency-input';
import * as ImagePicker from 'react-native-image-picker';
//import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

export default function DonationRegisterScreen({ navigation, route, navigator }) {

  // console.log(navigation.state.params.user, "===navigation.state.params.user===");

  const [type, setType] = useState(navigation.state.params.type);
  const [user, setUser] = useState(navigation?.state?.params?.user);


  const forceUpdate = useForceUpdate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagesGallery, setImagesGallery] = useState([]);
  const [money, setMoney] = useState(0.00);
  const [loading, setLoading] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const { latitude, longitude, returnToken } = useContext(AuthContext);
  const { selectLanguage, language } = useContext(LanguagesContext);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  // const handleForceUpdate = React.useCallback(() => {
    // forceUpdate();
  // }, [forceUpdate]);

  const handleAddImage = React.useCallback((arrayImage) => {
    for (let index = 0; index < arrayImage.length; index++) {
      imagesGallery.push({ src: arrayImage[index].realPath, id: arrayImage[index].fileName });
    }
    handleForceUpdate()
  }, [imagesGallery]);

  useEffect(() => {
    handleGetCityByLocaltion();

  }, [latitude, longitude]);

  useEffect(() => {
    
    type !== 'Dinheiro' ? handleGetCategory() : null;

  }, []);

  const handleGetCategory = async () => {
    setLoadingCategory(true);
    await api.get('/categories').then(response => {
      // console.log(response.data, "AQUIII")
      setCategories(response.data);
      // setSelectedCategory(response.data[0].id);
      setLoadingCategory(false);

    }).catch(error => {
      // console.log(error, "ERROROROROROR");
      customToast(selectLanguage?.messageCategoryError, 'danger');
      // Alert.alert('Erro ao buscar categorias, tente novamente mais tarde');
      setLoadingCategory(false);
      navigation.navigate('Home');
    })
  }

  const handleImagePicker = async () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  async function handleGetCityByLocaltion() {
    if(!latitude || !longitude) return null;

    if (latitude && longitude) {
      setLoadingAddress(true);
      await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`).then(response => {
        // console.log(response.data, "AQUIII")
        if (response.data.display_name) {
          setAddress(response.data.display_name);
          setLoadingAddress(false);
        }
        setLoadingAddress(false);

      }).catch(error => {
        Alert.alert(error, selectLanguage?.messageAddressError);
        setLoadingAddress(false);
      })
    }
    // if (response.data.address.city) {
    //   setCity(response.data.address.city);
    // }
    // else if (response?.data?.address?.hamlet) {
    //   setCity(response?.data?.address?.hamlet);
    // }
    // else if (response?.data?.address?.city_district) {
    //   setCity(response?.data?.address?.city_district);
    // }

    // if (response.data.address.suburb) {
    //   setNeighborhood(response.data.address.suburb);
    // }



    // setState(response?.data?.address?.state);
    // setCountry(response?.data?.address?.country);
  }

  const actionSheetRef = createRef();

  const openGallery = async () => {
    setLoadingPhoto(true);

    let result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 10,
    });

    console.log(result);
    if (!result.didCancel) {
      // const manipResult = await manipulateAsync(
      //   result.localUri || result.uri,
      //   [
      //     { rotate: 360 },
      //   ],
      //   { compress: 1, format: SaveFormat.JPG, quality: 0.8 }
      // );
      actionSheetRef.current?.setModalVisible(false);
      //console.log(manipResult, "manipResult")
      result.assets.map((asset) => {
        imagesGallery.push({ src: asset.uri, id: asset.uri });

      })
      // setImage(manipResult);
      setLoadingPhoto(false);
    }
    else {
      actionSheetRef.current?.setModalVisible(false);
      setLoadingPhoto(false);
    }
    console.log(imagesGallery);
  };

  const openCamera = async () => {
    setLoadingPhoto(true);
    const permissionResult = await PermissionsAndroid.request( PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },);

    if (permissionResult.granted === false) {
      customToast(selectLanguage?.messagePermissionRejected, 'info');
      openCamera();
      actionSheetRef.current?.setModalVisible(false);
      return;
    }

    const result = await ImagePicker.launchCamera();

    console.log(result);
    if (!result.didCancel) {
      // const manipResult = await manipulateAsync(
      //   result.localUri || result.uri,
      //   [
      //     { rotate: 360 },
      //   ],
      //   { compress: 1, format: SaveFormat.JPG, quality: 0.8 }
      // );
      actionSheetRef.current?.setModalVisible(false);
      //console.log(manipResult, "manipResult")
      imagesGallery.push({ src: result.assets[0].uri, id: result.assets[0].uri });
      // setImage(manipResult);
      setLoadingPhoto(false);
    }
    else {
      actionSheetRef.current?.setModalVisible(false);
      setLoadingPhoto(false);
    }
    console.log(imagesGallery);
  }

  async function handleRegisterPhoto(product) {

    // console.log(product, "PRODUCT")

    let error = false;
    const token = await returnToken();

    for (let index = 0; index < imagesGallery.length; index++) {
      // console.log(imagesGallery[index].id, "IMAGES")
      if (imagesGallery[index]?.src) {
        // console.log(imagesGallery[index], "IF IMAGE")
        let typeImg = imagesGallery[index].src.substring(imagesGallery[index].src.lastIndexOf(".") + 1);
        let formData = new FormData();

        formData.append("files", {
          uri: imagesGallery[index].src,
          name: `media.${typeImg}`,
          type: `image/${typeImg}`,
        });

        type === 'Doação' ? formData.append("ref", "product") :
        type === 'Serviços' ? formData.append("ref", "product-services") :
        type === 'Troca-troca' ? formData.append("ref", "product-trocatroca") :
        type === 'instituicoes' ? formData.append("ref", "product-institutions") : null;

        formData.append("refId", product.id);
        // formData.append("ref", 'product');
        formData.append("field", 'photos');
        formData.append("source", 'content-manager');

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }

        const res = await fetch(`${BASE_URL}/upload`, options);

        const responseImg = await res.json();

        console.log(responseImg[0], "responseImg")

        if (!responseImg[0]?.id) {
          error = true;
        }
      }
    }
    if (error !== true) {
      setLoading(false);
      setLoading(false);
      setName('');
      setDescription('');
      setMoney(0.00);
      setSelectedCategory(null);
      setImagesGallery([]);

      let screen = ''

      type === 'Doação' ? screen = 'doacoes' :
        type === 'Serviços' ? screen = 'servicos' :
        type === 'Troca-troca' ? screen = 'trocatroca' :
        type === 'instituicoes' ? screen = 'instituicoes' : null;

      navigation.navigate('Home', { success: true, backScreen: true, screen: screen });
      customToast(selectLanguage?.messageProductSuccess, 'success');
    }
    else {
      setLoading(false);
      setImagesGallery([]);
      customToast(selectLanguage?.messageProductSucessWithError, "info");
    }
  }

  async function handleRegisterProductDonation() {
    // const data = new FormData();
    // data.append('name', name);
    // data.append('description', description);
    // data.append('type', "donation");
    // data.append('photos', imagesGallery[0].realPath);

    // data.append('photos', {
    //   uri: `file://${imagesGallery[0].realPath}`,
    //   name: name,
    //   type: 'image/jpg',

    // });
    if (loading) return;
    setLoading(true);
    if (name && description && selectedCategory && address) {
      const data = {
        name: name,
        description: description,
        category: selectedCategory,
        type: "doacoes",
        user: user.id,
        latitude: latitude,
        longitude: longitude,
        address: address,
        neighborhood: neighborhood,
        city: city,
        state: state,
        country: country,
      }

      api.post("products/", data)
        .then((response) => {
          console.log(response?.data, "response")
          handleRegisterPhoto(response?.data);

          // setLoading(false);
          // setName('');
          // setDescription('');
          // setSelectedCategory(null);
          // setImagesGallery([]);
          // customToast("Produto cadastrado com sucesso", "success");
          // navigation.navigate('Home', { success: true, backScreen: true, screen: "doacoes" })
        })
        .catch((err) => {
          setLoading(false);
          console.error(selectLanguage?.messageError + err);
        });
    } else {
      setLoading(false);
      customToast(selectLanguage?.messageAllFieldsRequired, "error");
    }
  }

  async function handleRegisterProductInstution() {
    if (loading) return;
    setLoading(true);

    if (name && description && address) {
      const data = {
        name: name,
        description: description,
        type: money ? "dinheiro" : "servico",
        money: money,
        user: user.id,
        latitude: latitude,
        longitude: longitude,
        address: address,
        neighborhood: neighborhood,
        city: city,
        state: state,
        country: country,
      }
      console.log(data, "DATA")
      api.post("product-institutions/", data)
        .then((response) => {
          handleRegisterPhoto(response.data);
          // setName('');
          // setDescription('');
          // setImagesGallery([]);
          // setMoney(0.00);
          // customToast("Produto cadastrado com sucesso", "success");
          // setLoading(false);
          // navigation.navigate('Home', { success: true, backScreen: true, screen: "instituicoes" })
        }
        )
        .catch((err) => {
          console.error("ops! ocorreu um erro " + err);
          setLoading(false);
          customToast(selectLanguage?.messageError, "error");
        });
    } else {
      setLoading(false);
      customToast(selectLanguage?.messageAllFieldsRequired, "error");
    }
  }

  async function handleRegisterProductService() {
    if (loading) return;
    setLoading(true);
    if (name && description && selectedCategory && address) {
      const data = {
        name: name,
        description: description,
        category: selectedCategory,
        type: "servicos",
        money: null,
        user: user.id,
        latitude: latitude,
        longitude: longitude,
        address: address,
        neighborhood: neighborhood,
        city: city,
        state: state,
        country: country,
      }
      api.post("product-services/", data)
        .then((response) => {
          // console.log(response.data, "response")
          handleRegisterPhoto(response.data);
          // setName('');
          // setDescription('');
          // setImagesGallery([]);
          // customToast("Serviço cadastrado com sucesso", "success");
          // setLoading(false);
          // navigation.navigate('Home', { success: true, backScreen: true, screen: "servicos" })
        }
        )
        .catch((err) => {
          console.error("ops! ocorreu um erro " + err);
          setLoading(false);
          customToast(selectLanguage?.messageError, "error");
        });
    } else {
      setLoading(false);
      customToast(selectLanguage?.messageAllFieldsRequired, "error");
    }
  }

  async function handleRegisterProductTrocatroca() {
    if (loading) return;
    setLoading(true);
    if (name && description && selectedCategory && address) {
      const data = {
        name: name,
        description: description,
        category: selectedCategory,
        type: "trocatroca",
        money: null,
        user: user.id,
        latitude: latitude,
        longitude: longitude,
        address: address,
        neighborhood: neighborhood,
        city: city,
        state: state,
        country: country,
      }
      api.post("product-trocatrocas/", data)
        .then((response) => {
          // console.log(response.data, "response")
          handleRegisterPhoto(response.data);
          // setName('');
          // setDescription('');
          // setImagesGallery([]);
          // customToast("Produto cadastrado com sucesso", "success");
          // setLoading(false);
          // navigation.navigate('Home', { success: true, backScreen: true, screen: "trocatroca" })
        }
        )
        .catch((err) => {
          console.error("ops! ocorreu um erro " + err);
          setLoading(false);
          customToast(selectLanguage?.messageError, "error");
        });
    } else {
      setLoading(false);
      customToast(selectLanguage?.messageAllFieldsRequired, "error");
    }
  }

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>

        <ActionSheet
          ref={actionSheetRef}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 30, paddingTop: 30 }}>
            <TouchableOpacity onPress={() => openGallery()}
            >
              <MaterialCommunityIcons
                name='folder-image'
                style={{ fontSize: normalize(30), color: '#F4AE38', marginLeft: 50 }}
              />
            </TouchableOpacity>

            <Text onPress={() => openGallery()} style={{ marginLeft: 5, color: "#808080" }}>{selectLanguage?.gallery}</Text>

            <TouchableOpacity onPress={() => openCamera()}
            >
              <MaterialCommunityIcons
                name='camera'
                style={{ fontSize: normalize(28), color: '#F4AE38', marginLeft: 80 }}
              />
            </TouchableOpacity>

            <Text onPress={() => openCamera()} style={{ marginLeft: 5, color: "#808080" }}>{selectLanguage?.camera}</Text>
          </View>
        </ActionSheet>
        <View style={styles.background}>
          {/* {console.log(imagesGallery, "IMAGES GALLERY")} */}
          <Gallery
            thumbnailImageStyles={{
              height: 130,
              width: 130,
              borderRadius: 6,
            }}
            loaderColor="#FDCC58"
            borderColor="#F4AE38"
            images={imagesGallery}
            activeIndex={0}
            navigator={navigator}
          />
        </View>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {imagesGallery.length <= 10 ? (
            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => {handleImagePicker()}} style={styles.addImg}>
                {!loadingPhoto ? (
                  <Text style={styles.addImgText}>{selectLanguage?.addPhoto}</Text>
                ) : (
                  <ActivityIndicator size="small" color="#FFF" />
                )}
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => handleImagePicker()} style={styles.deleteImg}>
                <Text style={styles.addImgText}>Apagar foto</Text>
              </TouchableOpacity> */}
            </View>
          ) : (
            <TouchableOpacity onPress={() => customToast(selectLanguage?.messageErrorMaxPhotos, "error")} style={styles.addImgDesactive}>
              <Text style={styles.addImgText}>{selectLanguage?.addPhoto}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.name}
            autoCorrect={false}
            onChangeText={(name) => { setName(name) }}
            placeholderTextColor="#ccc" 
          />

          <TextInput
            style={styles.textArea}
            placeholder={selectLanguage?.description}
            autoCorrect={false}
            value={description}
            multiline={true}
            numberOfLines={5}
            placeholderTextColor="#ccc" 
            onChangeText={(description) => setDescription(description)}
          />
          {type !== 'Dinheiro' ? (
            loadingCategory ? (
              <ActivityIndicator size="small" color="#FDCC58" />
            ) : (
              <Picker
                style={styles.input}
                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedCategory(itemValue)
                }>
                <Picker.Item label={selectLanguage?.selectCategory} value={null} />
                {categories?.map((category, index) => (
                  language === 'pt-BR' ? (
                    <Picker.Item key={index} label={category.name_pt_br} value={category.id} />
                  ) : language === 'en-US' ? (
                    <Picker.Item key={index} label={category.name_en_us} value={category.id} />
                  ) : language === 'es-ES' ? (
                    <Picker.Item key={index} label={category.name_es} value={category.id} />
                  ) : language === 'it-IT' ? (
                    <Picker.Item key={index} label={category.name_it} value={category.id} />
                  ) : language === 'de-DE' ? (
                    <Picker.Item key={index} label={category.name_de} value={category.id} />
                  ) : (
                    <Picker.Item key={index} label={category.name_pt_br} value={category.id} />
                  )
                ))}
              </Picker>
            )
          ) : (
            null
          )}

          {!loadingAddress ? (
            <>
              <TouchableOpacity onPress={() => {
                navigation.navigate('MapLocation', { goHome: false })
              }}>
                <View style={styles.input}>
                  <TextInput
                    style={styles.textArea}
                    placeholder={selectLanguage?.address}
                    autoCorrect={false}
                    value={address}
                    multiline={true}
                    numberOfLines={3}
                    editable={false}
                    placeholderTextColor="#ccc" 
                    onChangeText={() => setAddress(address)}
                  />
                </View>
              </TouchableOpacity>
              <Text style={{ color: "#F00" }}>{selectLanguage?.clickToSelectMap}</Text>
            </>
          ) : (
            <ActivityIndicator size="small" color="#FDCC58" />
          )}
          {type == 'Dinheiro' ? (
            <CurrencyInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder={selectLanguage?.valueMinDonation}
              value={money}
              onChangeValue={setMoney}
              prefix="R$"
              delimiter="."
              separator=","
              precision={2}
              minValue={0}
              onChangeText={(formattedValue) => {
                console.log(formattedValue);
              }}
            />
          ) : (
            null
          )}

          {/* <Picker
            style={{
              fontSize: 40,
              color: 'gray',
              fontWeight: 'bold',
              marginTop: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'gray',
              backgroundColor: '#FFF',
              width: '100%',
              height: 50,
              textAlign: 'center',
            }}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedLanguage(itemValue)
            }>
            <Picker.Item label="Selecione a cidade" value="" />
            <Picker.Item label="JavaScript" value="js" />

            <Picker.Item label="JavaScript" value="js2" />
          </Picker> */}

          <TouchableOpacity
            style={styles.buttonSubmit}
            onPress={() => {
              // console.log(type, "===type")
              // console.log(user, "===user")
              // customToast('Em breve!', 'info')
              // loading ? customToast('Aguarde...', 'info') :
              user.type == 'person' && type == 'Doação' ? handleRegisterProductDonation() :
                user.type == 'person' && type == 'Serviços' ? handleRegisterProductService() :
                  user.type == 'person' && type == 'Troca-troca' ? handleRegisterProductTrocatroca() :
                    user.type == 'company' && type == 'instituicoes' ? handleRegisterProductInstution()
                      : customToast(selectLanguage?.messageErrorAcessDanied, 'error');
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textSubmit}>{selectLanguage?.register}</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
