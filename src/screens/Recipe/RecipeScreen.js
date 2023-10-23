import React from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableHighlight,
  Linking,
  Alert,
} from 'react-native';
import styles from './styles';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import BackButton from '../../components/BackButton/BackButton';
import {ActivityIndicator, FAB} from 'react-native-paper';
import {BASE_URL} from '../../services/api';
import {customToast} from '../../util';
import format from 'date-fns/format';
import {parseISO} from 'date-fns';
import api from '../../services/api';
import {LanguagesContext} from '../../contexts/Languages';
import Modal from 'react-native-modal';
import {SingleImage} from 'react-native-zoom-lightbox';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width: viewportWidth} = Dimensions.get('window');
const {height: viewportHeight} = Dimensions.get('window');
let image = '';

export default class RecipeScreen extends React.Component {
  static contextType = LanguagesContext;

  static navigationOptions = ({navigation}) => {
    return {
      headerTransparent: 'true',
      title: '',
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      loading: false,
      isModalVisible: false,
      goHome: props.navigation?.state?.params?.goHome,
    };
  }

  renderImage = ({item}, key) => {
    return <SingleImage uri={BASE_URL + item?.formats?.small?.url} style={styles.image} key={key}/>
    
  };

  sendWhatsapp = item => {
    const {navigation} = this.props;
    const {selectLanguage} = this.context;
    const user = navigation.getParam('user');
    const type = navigation.getParam('type');
    // console.log(type, "===type===");
    let type_product = '';
    this.setState({loading: true});
    type === 'doacoes'
      ? (type_product = 'product_donation')
      : type === 'servicos'
      ? (type_product = 'product_service')
      : type === 'trocatroca'
      ? (type_product = 'product_trocatroca')
      : type === 'instituicoes'
      ? (type_product = 'product_institution')
      : (type_product = 'product_error');

    api
      .post('/donations', {
        user_donor: item?.user?.id,
        user_receiver: user?.id,
        [type_product]: item?.id,
      })
      .then(response => {
        // console.log(response.data, "===RESPONSE===");

        // Insert notifications - Refact to backend
        api
          .post('/notifications', {
            user_donor: item?.user?.id,
            user_receiver: user?.id,
            [type_product]: item?.id,
            donation: response?.data?.id,
          })
          .then(response => {
            // console.log(response.data, "===RESPONSE===");
            Linking.openURL(
              'https://api.whatsapp.com/send?phone=' +
                item?.user?.phone +
                selectLanguage?.messageWhatsAppContact +
                item.name,
            );
            this.setState({loading: false});
            navigation.navigate('Home', {
              success: true,
              backScreen: true,
              screen: type,
            });
          })
          .catch(error => {
            console.log(error, '===ERROR===');
            customToast(selectLanguage?.messageWhatsAppError, 'danger');
            this.setState({loading: false});
          });
      })
      .catch(error => {
        console.log(error, '===ERROR===');
        customToast(selectLanguage?.messageWhatsAppError, 'danger');
        this.setState({loading: false});
      });
  };

  // Doações
  removeProductPerson = async () => {
    const {selectLanguage} = this.context;
    console.log('removeProductPerson');
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const {id} = item;
    api
      .post(`products/update-cancelled/${id}`)
      .then(response => {
        this.setState({
          data: response?.data,
          loading: false,
        });
        customToast(selectLanguage?.messageSucessDeleteProduct, 'success');
        // console.log(this.state.goHome, "===RESPONSE===");
        this.state.goHome || this.state.goHome == undefined
          ? navigation.navigate('Home', {
              success: true,
              backScreen: true,
              screen: 'doacoes',
            })
          : navigation.navigate('MyProductsDonation', {
              success: true,
              backScreen: true,
              screen: 'doacoes',
            });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageErrorDeleteProduct, 'danger');
      });
  };

  // Serviços
  removeServicePerson = async () => {
    const {selectLanguage} = this.context;
    // console.log("removeServicePerson")
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const {id} = item;
    this.setState({loading: true});
    api
      .post(`product-services/update-cancelled/${id}`)
      .then(response => {
        this.setState({
          data: response?.data,
          loading: false,
        });
        // console.log(response.data, "AQUIIII")
        customToast(selectLanguage?.messageSucessDeleteService, 'success');
        this.state.goHome || this.state.goHome == undefined
          ? navigation.navigate('Home', {
              success: true,
              backScreen: true,
              screen: 'servicos',
            })
          : navigation.navigate('MyProductsDonation', {
              success: true,
              backScreen: true,
              screen: 'servicos',
            });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        customToast(selectLanguage?.messageErrorDeleteService, 'danger');
        console.error('ops! ocorreu um erro ' + err);
      });
  };

  // Troca-Troca
  removeTrocaTrocaPerson = async () => {
    const {selectLanguage} = this.context;
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const {id} = item;
    api
      .post(`product-trocatrocas/update-cancelled/${id}`)
      .then(response => {
        this.setState({
          data: response?.data,
          loading: false,
        });
        customToast(selectLanguage?.messageSucessDeleteProduct, 'success');
        this.state.goHome || this.state.goHome == undefined
          ? navigation.navigate('Home', {
              success: true,
              backScreen: true,
              screen: 'trocatroca',
            })
          : navigation.navigate('MyProductsDonation', {
              success: true,
              backScreen: true,
              screen: 'trocatroca',
            });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageErrorDeleteProduct, 'danger');
      });
  };

  removeProductInstitutions = async () => {
    const {selectLanguage} = this.context;
    console.log('removeProductInstitutions');
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const {id} = item;
    api
      .post(`product-institutions/${id}`)
      .then(response => {
        this.setState({
          data: response?.data,
          loading: false,
        });
        customToast(selectLanguage?.messageSucessDeleteProduct, 'success');
        this.state.goHome || this.state.goHome == undefined
          ? navigation.navigate('Home', {
              success: true,
              backScreen: true,
              screen: 'instituicoes',
            })
          : navigation.navigate('MyProductsDonation', {
              success: true,
              backScreen: true,
              screen: 'instituicoes',
            });
      })
      .catch(err => {
        this.setState({
          loading: false,
        });
        console.error('ops! ocorreu um erro ' + err);
        customToast(selectLanguage?.messageErrorDeleteProduct, 'danger');
      });
  };

  render() {
    const {selectLanguage} = this.context;
    const {activeSlide} = this.state;
    const {navigation} = this.props;
    const item = navigation.getParam('item');
    const user = navigation.getParam('user');
    // const type = navigation.getParam("type");
    const type = item?.type;
    // const category = getCategoryById(item.categoryId);
    // const title = getCategoryName(category.id);

    return (
      <>
        <ScrollView style={styles.container}>
          <View style={styles.carouselContainer}>
            <View style={styles.carousel}>
              <Carousel
                ref={c => {
                  this.slider1Ref = c;
                }}
                data={
                  item?.photos?.length > 0
                    ? item?.photos
                    : ['../../assets/images/donaremoney.jpeg']
                }
                renderItem={this.renderImage}
                sliderWidth={viewportWidth}
                itemWidth={viewportWidth}
                firstItem={0}
                loop={true}
                autoplay={false}
                autoplayDelay={500}
                autoplayInterval={3000}
                onSnapToItem={index => this.setState({activeSlide: index})}
              />
              <Pagination
                dotsLength={item?.photos?.length ? item?.photos?.length : 1}
                activeDotIndex={activeSlide}
                containerStyle={styles.paginationContainer}
                dotColor="#F4AE38"
                dotStyle={styles.paginationDot}
                inactiveDotColor="white"
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
                carouselRef={this.slider1Ref}
                tappableDots={!!this.slider1Ref}
              />
            </View>
          </View>
          <View style={styles.infoRecipeContainer}>
            <Text style={styles.infoRecipeName}>{item?.name}</Text>
            <View style={styles.infoContainer}>
              <TouchableHighlight onPress={() => null}>
                <Text style={styles.category}>
                  {item?.category?.name?.toUpperCase()}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={styles.infoContainer}>
              <Text
                style={[
                  styles.dateCityState,
                  {color: '#F4AE38', fontSize: 18},
                ]}>
                {format(parseISO(item?.created_at), 'HH:mm:ss - dd/MM/yyyy')}
              </Text>
              <Text style={styles.dateCityState}>{item?.address}</Text>
            </View>
            {/* {console.log(item, "===ITEM OOO===")} */}
            {item?.money ? (
              <>
                <View style={styles.infoContainer}>
                  <Image
                    style={styles.infoPhoto}
                    source={require('../../../assets/icons/care.png')}
                  />
                  <Text style={styles.infoRecipe}>
                    ${selectLanguage?.valueMinimum}
                    {item?.money}
                  </Text>
                </View>

                {/* <View style={styles.infoContainer}>
                  <ViewIngredientsButton
                    onPress={() => {
                      let ingredients = item.ingredients;
                      let title = "Ingredients for " + item.title;
                      navigation.navigate("IngredientsDetails", { ingredients, title });
                    }}
                  />
                </View> */}
              </>
            ) : null}
            {/* <View style={styles.infoContainer}>
            <Image style={styles.infoPhoto} source={require("../../../assets/icons/contact.png")} />
            <Text style={styles.infoRecipe}>Entre em contato agora</Text>
          </View>

          <View style={styles.infoContainer}>
            <ViewIngredientsButton
              onPress={() => {
                let ingredients = item.ingredients;
                let title = "Ingredients for " + item.title;
                navigation.navigate("IngredientsDetails", { ingredients, title });
              }}
            />
          </View> */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoDescriptionRecipe}>
                {item.description}
              </Text>
            </View>
          </View>
        </ScrollView>
        {user.type == 'person' && item?.user?.id != user.id && !item.money ? (
          this.state.loading ? (
            <ActivityIndicator
              size="medium"
              color="#F4AE38"
              style={{backgroundColor: '#fff'}}
            />
          ) : (
            <FAB
              style={styles.fab}
              small
              label={selectLanguage?.btnContact}
              color="#FFF"
              icon="whatsapp"
              onPress={() => {
                type !== 'trocatroca'
                  ? Alert.alert(
                      selectLanguage?.btnContactText,
                      selectLanguage?.btnContactText2,
                      [
                        {
                          text: selectLanguage?.cancel,
                          onPress: () => console.log('Cancel Pressed'),
                        },
                        {text: 'OK', onPress: () => this.sendWhatsapp(item)},
                      ],
                    )
                  : navigation.navigate('SelectedProductTrocaTroca', {
                      item,
                      user,
                    });
              }}
            />
          )
        ) : user.type == 'person' &&
          item?.user?.id == user.id &&
          !item.money &&
          item.status == 'in_progress' ? (
          <FAB
            style={[styles.fab, {backgroundColor: '#e74c3c'}]}
            small
            label={selectLanguage?.btnRemoveProduct}
            color="#FFF"
            icon="cancel"
            onPress={() => {
              Alert.alert(
                selectLanguage?.btnAtencion,
                selectLanguage?.btnRemoveText,
                [
                  {
                    text: selectLanguage?.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: selectLanguage?.remove,
                    onPress: () => {
                      this.setState({loading: true});
                      // console.log(type, "typetypetypetype")
                      user.type == 'person' && type == 'doacoes'
                        ? this.removeProductPerson()
                        : user.type == 'person' && type == 'servicos'
                        ? this.removeServicePerson()
                        : user.type == 'person' && type == 'trocatroca'
                        ? this.removeTrocaTrocaPerson()
                        : customToast(
                            selectLanguage?.messageErrorAcessDanied,
                            'error',
                          );
                    },
                  },
                ],
                {cancelable: false},
              );
            }}
          />
        ) : user.type == 'company' && item?.user?.id !== user.id ? (
          <FAB
            style={styles.fab}
            small
            label={selectLanguage?.DONATE}
            color="#FFF"
            icon="cash"
            onPress={() => {
              customToast(selectLanguage?.development, 'info');
            }}
          />
        ) : user.type == 'company' && item?.user?.id === user.id ? (
          <FAB
            style={[styles.fab, {backgroundColor: '#e74c3c'}]}
            small
            label={selectLanguage?.btnRemoveProduct}
            color="#FFF"
            icon="cancel"
            onPress={() => {
              Alert.alert(
                selectLanguage?.btnAtencion,
                selectLanguage?.questionRemoveAds,
                [
                  {
                    text: selectLanguage?.cancel,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: selectLanguage?.remove,
                    onPress: () => this.removeProductInstitutions(),
                  },
                ],
                {cancelable: false},
              );
            }}
          />
        ) : null}
      </>
    );
  }
}

/*cooking steps
<View style={styles.infoContainer}>
  <Image style={styles.infoPhoto} source={require("../../../assets/icons/info.png")} />
  <Text style={styles.infoRecipe}>Cooking Steps</Text>
</View>
<Text style={styles.infoDescriptionRecipe}>{item.description}</Text>
*/
