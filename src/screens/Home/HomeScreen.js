import React, {useState, useEffect, useContext} from 'react';
import {
  FlatList,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import styles from './styles';
import MenuImage from '../../components/MenuImage/MenuImage';
import Filter from '../../components/Filter';
import Modal from 'react-native-modal';
import {ActivityIndicator, RadioButton} from 'react-native-paper';
import {customToast, normalize} from '../../util';
import {Input, ListItem, SearchBar} from 'react-native-elements';
import {FAB} from 'react-native-paper';
import {BASE_URL} from '../../services/api';
import api from '../../services/api';
import Location from 'react-native-geolocation-service';
import {AuthContext} from '../../contexts/Auth';
import {LanguagesContext} from '../../contexts/Languages';
import ModalAds from '../../components/ModalAds';
import format from 'date-fns/format';
import {parseISO} from 'date-fns';
import {LoadingSpinner} from '../../components/LoadingSpinner';

export default function HomeScreen({navigation}) {
  const [user, setUser] = useState(navigation?.state?.params?.user);
  const [anuncios, setAnuncios] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('doacoes');
  const [auxSelectedCategory, setAuxSelectedCategory] = useState('doacoes');
  const [isModalFilterVisible, setIsModalFilterVisible] = useState(false);
  const [isModalSearchVisible, setIsModalSearchVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [auxSearch, setAuxSearch] = useState('');
  const {setLatitude, setLongitude, latitude, longitude} =
    useContext(AuthContext);
  const {selectLanguage} = useContext(LanguagesContext);
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    (async () => {
      await handleGetLocation();
      if (isModalFilterVisible) {
        setIsModalFilterVisible(true);
      } else {
        setIsModalFilterVisible(false);
      }
    })();
  }, []);


  useEffect(() => {
    (async () => {
      if (latitude && longitude) {
        let user = navigation?.state?.params?.user;
        user?.type == 'person'
          ? await handleProductDonation(latitude, longitude)
          : handleProductInstitutions();
      }
    })();
  }, [latitude, longitude]);

  useEffect(() => {
    if (navigation?.state?.params?.backScreen) {
      const user = navigation?.state?.params?.user;
      if (user.type == 'person') {
        auxSelectedCategory == 'doacoes'
          ? handleProductDonation(latitude, longitude)
          : auxSelectedCategory == 'servicos'
          ? handleProductService(latitude, longitude)
          : auxSelectedCategory == 'instituicoes'
          ? handleProductInstitutionsShowPerson(latitude, longitude)
          : auxSelectedCategory == 'trocatroca'
          ? handleProductTrocatroca(latitude, longitude)
          : handleProductDonation();
      } else {
        handleProductInstitutions();
      }
    }
  }, [setLatitude, navigation]);

  handleShowModalSearch = () => {
    setIsModalSearchVisible(true);
  };

  handleShowModalFilter = () => {
    setIsModalFilterVisible(true);
  };

  onPressRecipe = item => {
    navigation.navigate('Recipe', {
      item,
      goHome: true,
      backScreen: false,
      user: user,
      type: auxSelectedCategory,
    });
  };

  renderRecipes = item => {
    if (item.item != undefined) {
      item = item.item;
    }

    return (
      <TouchableOpacity onPress={() => onPressRecipe(item)}>
        <View
          style={[
            styles.container,
            user.id === item?.user?.id
              ? {borderColor: '#F4AE38', borderWidth: 0.6}
              : {borderColor: '#cccccc'},
          ]}>
          {item?.photos[0] == undefined || !item?.photos[0] ? (
            <Image
              style={styles.photo}
              source={require('../../../assets/donaremoney.jpeg')}
            />
          ) : (
            <Image
              style={styles.photo}
              source={{uri: BASE_URL + item?.photos[0]?.formats?.small?.url}}
            />
          )}
          <Text style={styles.title}>{item?.name}</Text>
          <Text style={styles.category}>{item?.category?.name}</Text>
          <Text style={styles.city}>
            {item?.address
              ? item?.address?.substring(0, 36) + '...'
              : selectLanguage?.notInformaded}
          </Text>
          <Text style={styles.city}>
            {format(parseISO(item?.created_at), 'HH:mm:ss - dd/MM/yyyy')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  handleProductDonation = async (latitude, longitude) => {
    setLoading(true);
    setSearch('');

    if (latitude === undefined || longitude === undefined) {
      latitude = latitude;
      longitude = longitude;
    }

    api
      .post(`products/get-all/?latitude=${latitude}&longitude=${longitude}`)
      .then(response => {
        setAnuncios(response?.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err, 'ERR 1');
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  handleProductInstitutions = async () => {
    setLoading(true);
    setSearch('');

    api
      .get('product-institutions/get-all/')
      .then(response => {
        setAnuncios(response.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('INSTITUICAO ops! ocorreu um erro ' + err);
      });
  };

  handleProductService = async (latitude, longitude) => {
    setLoading(true);
    setSearch('');

    api
      .post(
        `product-services/get-all/?latitude=${latitude}&longitude=${longitude}`,
      )
      .then(response => {
        setAnuncios(response.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  handleProductInstitutionsShowPerson = async (latitude, longitude) => {
    setLoading(true);
    setSearch('');

    api
      .get(`product-institutions/?latitude=${latitude}&longitude=${longitude}`)
      .then(response => {
        setAnuncios(response.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(true);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  handleProductTrocatroca = async (latitude, longitude) => {
    setLoading(true);
    setSearch('');

    api
      .post(
        `product-trocatrocas/get-all/?latitude=${latitude}&longitude=${longitude}`,
      )
      .then(response => {
        setAnuncios(response.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  // SEARCH PRODUCTS

  handleSearchProductDonation = async (search, latitude, longitude) => {
    setLoading(true);

    if (!latitude || !longitude) {
      latitude = latitude;
      longitude = longitude;
    }

    api
      .post(
        `products/search-by-name-and-category/?_search=${search}&latitude=${latitude}&longitude=${longitude}`,
      )
      .then(response => {
        setAnuncios(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err, 'ERR 2');
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  handleSearchProductService = async (search, latitude, longitude) => {
    setLoading(true);
    api
      .post(
        `product-services/search-by-name-and-category/?_search=${search}&latitude=${latitude}&longitude=${longitude}`,
      )
      .then(response => {
        setAnuncios(response.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  handleSearchProductInstitutionsShowPerson = async (
    search,
    latitude,
    longitude,
  ) => {
    setLoading(true);
    api
      .post(
        `product-institutions/search-by-name-and-category/?_search=${search}&latitude=${latitude}&longitude=${longitude}`,
      )
      .then(response => {
        setAnuncios(response?.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
  };

  handleSearchProductTrocatroca = async (search, latitude, longitude) => {
    setLoading(true);

    api
      .post(
        `product-trocatrocas/search-by-name-and-category/?_search=${search}&latitude=${latitude}&longitude=${longitude}`,
      )
      .then(response => {
        setAnuncios(response?.data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageError, 'error');
      });
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
                  goHome: true,
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

  itemsList = () => {

    return (
      <View>
        {/* {this.state?.user?.type == 'person' ? ( */}

        <ModalAds time={10000} />
        <View>
          {/* {console.log(item, "AQUI")} */}
          {/* <Text style={styles.titleDoacoes}>{item.type == "doacoes" ? "DOAÇÕES" : item.type == "servicos" ? "SERVIÇOS" : item.type == "instituicoes" ? "INSTITUIÇÕES" : "TROCA-TROCA"}</Text> */}
          {user?.type == 'company' ? (
            <Text style={styles.titleDoacoes}>
              {selectLanguage?.titleDonations}
            </Text>
          ) : user?.type == 'person' && auxSearch.length > 0 ? (
            <Text style={styles.titleDoacoes}>
              {selectLanguage?.resultsBy} {auxSearch}:
            </Text>
          ) : (
            <Text style={styles.titleDoacoes}>{selectLanguage?.adverts}</Text>
          )}
          {loading ? (
            <>
              <ActivityIndicator
                size="large"
                color="#F4AE38"
                style={{marginTop: 20}}
              />
              {/* <LoadingSpinner
                visible={loading}
                text={selectLanguage?.loadingData}
                color={'#FFF'}
              /> */}
            </>
          ) : anuncios && anuncios.length > 0 ? (
            <FlatList
              vertical
              showsVerticalScrollIndicator={true}
              numColumns={2}
              data={anuncios}
              renderItem={({item}) => renderRecipes(item)}
              ListFooterComponent={<View style={{
                minHeight: windowHeight * 0.35,
              }}></View>}
              keyExtractor={item => `${item.id}`}
            />
          ) : (
            <Text style={styles.text}>{selectLanguage?.noData}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <View>
        <Modal
          isVisible={isModalFilterVisible}
          onBackdropPress={() => {
            setIsModalFilterVisible(false);
          }}>
          <View
            style={{
              backgroundColor: '#FFF',
              padding: 10,
              margin: 30,
              height: 340,
            }}>
            <>
              <Text>{selectLanguage?.category}</Text>
              <RadioButton.Group
                onValueChange={value => {
                  setAuxSelectedCategory(value);
                }}
                value={auxSelectedCategory}>
                <RadioButton.Item
                  label={selectLanguage?.donation}
                  value="doacoes"
                  color={'#F4AE38'}
                />
                <RadioButton.Item
                  label={selectLanguage?.services}
                  value="servicos"
                  color={'#F4AE38'}
                />
                <RadioButton.Item
                  label={selectLanguage?.institution}
                  value="instituicoes"
                  color={'#F4AE38'}
                />
                <RadioButton.Item
                  label={selectLanguage?.trocaTroca}
                  value="trocatroca"
                  color={'#F4AE38'}
                />
              </RadioButton.Group>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setIsModalFilterVisible(false);
                  setSelectedCategory(auxSelectedCategory);
                  {
                    auxSelectedCategory == 'doacoes'
                      ? handleProductDonation(latitude, longitude)
                      : auxSelectedCategory == 'servicos'
                      ? handleProductService(latitude, longitude)
                      : auxSelectedCategory == 'instituicoes'
                      ? handleProductInstitutionsShowPerson(latitude, longitude)
                      : handleProductTrocatroca(latitude, longitude);
                  }
                }}>
                <Text style={{color: '#FFF', textAlign: 'center'}}>
                  {selectLanguage?.confirm}
                </Text>
              </TouchableOpacity>
            </>
          </View>
        </Modal>

        <Modal
          isVisible={isModalSearchVisible}
          onBackdropPress={() => {
            setIsModalSearchVisible(false);
          }}>
          <View
            style={{
              backgroundColor: '#FFF',
              padding: 10,
              margin: 30,
              height: 280,
            }}>
            <>
              <Text>{selectLanguage?.search}</Text>
              <SearchBar
                containerStyle={{
                  backgroundColor: '#fff',
                  borderBottomColor: '#fff',
                  borderTopColor: '#fff',
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: 10,
                }}
                inputContainerStyle={{
                  backgroundColor: '#EDEDED',
                }}
                inputStyle={{
                  backgroundColor: '#EDEDED',
                  borderRadius: 8,
                  color: 'black',
                  width: width * 0.6,
                }}
                searchIcond
                clearIcon
                editable={true}
                onChangeText={text => {
                  setSearch(text);
                }}
                placeholder={selectLanguage?.typeItYourSearch}
                value={search}
              />
              <TouchableOpacity
                style={[styles.button, {marginBottom: 60}]}
                onPress={() => {

                  search === '' && auxSelectedCategory === 'doacoes'
                    ? handleProductDonation(latitude, longitude)
                    : search === '' && auxSelectedCategory === 'servicos'
                    ? handleProductService(latitude, longitude)
                    : search === '' && auxSelectedCategory === 'instituicoes'
                    ? handleProductInstitutionsShowPerson(latitude, longitude)
                    : search === '' && auxSelectedCategory === 'trocatroca'
                    ? handleSearchProductTrocatroca(latitude, longitude)
                    : search !== '' && auxSelectedCategory === 'doacoes'
                    ? handleSearchProductDonation(search, latitude, longitude)
                    : search !== '' && auxSelectedCategory === 'servicos'
                    ? handleSearchProductService(search, latitude, longitude)
                    : search !== '' && auxSelectedCategory === 'instituicoes'
                    ? handleSearchProductInstitutionsShowPerson(
                        search,
                        latitude,
                        longitude,
                      )
                    : search !== '' && auxSelectedCategory === 'trocatroca'
                    ? handleSearchProductTrocatroca(search, latitude, longitude)
                    : handleProductDonation(latitude, longitude);
                  setAuxSearch(search);
                  setIsModalSearchVisible(false);
                }}>
                <Text style={{color: '#FFF', textAlign: 'center'}}>
                  {selectLanguage?.searchText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: '#e74c3c'}]}
                onPress={() => {
                  setSearch('');
                  auxSelectedCategory == 'doacoes'
                    ? handleProductDonation(latitude, longitude)
                    : auxSelectedCategory == 'servicos'
                    ? handleProductService(latitude, longitude)
                    : auxSelectedCategory == 'instituicoes'
                    ? handleProductInstitutionsShowPerson(latitude, longitude)
                    : handleProductTrocatroca(latitude, longitude);
                  setAuxSearch('');
                  setIsModalSearchVisible(false);
                }}>
                <Text style={{color: '#FFF', textAlign: 'center'}}>
                  {selectLanguage?.clean}
                </Text>
              </TouchableOpacity>
            </>
          </View>
        </Modal>
      </View>
      {itemsList()}
      {user?.type == 'person' ? (
        selectedCategory == 'doacoes' ? (
          <FAB
            style={styles.fab}
            small
            label={selectLanguage?.wantToDonate}
            color="#FFF"
            icon="check"
            onPress={() => {
              navigation.navigate('DonationRegister', {
                user: user,
                type: 'Doação',
              });
            }}
          />
        ) : selectedCategory == 'servicos' ? (
          <FAB
            style={styles.fab}
            small
            label={selectLanguage?.advertiseService}
            color="#FFF"
            icon="check"
            onPress={() => {
              navigation.navigate('ServiceRegister', {
                user: user,
                type: 'Serviços',
              });
            }}
          />
        ) : selectedCategory == 'instituicoes' ? null : (
          <FAB
            style={styles.fab}
            small
            label={selectLanguage?.advertiseProduct}
            color="#FFF"
            icon="check"
            onPress={() => {
              navigation.navigate('TrocatrocaRegister', {
                user: user,
                type: 'Troca-troca',
              });
            }}
          />
        )
      ) : (
        <>
          <FAB
            style={styles.fab}
            small
            label={selectLanguage?.advertiseService}
            color="#FFF"
            icon="check"
            onPress={() => {
              navigation.navigate('ServiceRegister', {
                type: 'instituicoes',
                user: user,
                goHome: true,
              });
            }}
          />
        </>
      )}
    </>
  );
}

const {width, height} = Dimensions.get('window');
HomeScreen.navigationOptions = ({navigation}) => ({
  headerStyle: {
    backgroundColor: '#F4AE38',
  },
  headerTintColor: '#FFF',
  headerLeft: () => (
    <MenuImage
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  ),
  headerTitle: () =>
    navigation.getParam('user', {}).type == 'person' ? (
      <View
        style={
          Platform.OS === 'android'
            ? {flexDirection: 'row'}
            : {flexDirection: 'row', paddingBottom: 10}
        }>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: width * 0.6,
            opacity: 1,
          }}
          activeOpacity={1}
          onPress={() => {
            handleShowModalSearch();
          }}>
          <SearchBar
            containerStyle={{
              backgroundColor: 'transparent',
              borderBottomColor: 'transparent',
              borderTopColor: 'transparent',
              flex: 1,
            }}
            inputContainerStyle={{
              backgroundColor: '#EDEDED',
            }}
            inputStyle={{
              backgroundColor: '#EDEDED',
              borderRadius: 8,
              color: 'black',
              width: width * 0.6,
            }}
            searchIcon
            clearIcon
            editable={false}
            placeholder="..."
          />
        </TouchableOpacity>
      </View>
    ) : (
      <Text style={{fontSize: 20, textAlign: 'center', color: '#FFF'}}>
        Donare
      </Text>
    ),
  headerRight: () =>
    navigation.getParam('user', {}).type == 'person' ? (
      <Filter
        onPress={() => {
          handleShowModalFilter();
        }}
      />
    ) : (
      <TouchableOpacity
        style={styles.headerButtonContainer}
        onPress={() => {
          navigation.navigate('Notifications', {
            user: navigation.getParam('user', {}),
          });
        }}>
        {true ? (
          <Image
            style={styles.headerButtonImage}
            source={require('../../../assets/icons/notification.png')}
          />
        ) : (
          <Image
            style={styles.headerButtonImage}
            source={require('../../../assets/icons/hasNotification.png')}
          />
        )}
      </TouchableOpacity>
    ),
});

