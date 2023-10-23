import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Image,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  SafeAreaView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import MenuButton from '../../components/MenuButton/MenuButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  termsDe,
  termsEn,
  termsEs,
  termsIt,
  termsPt,
} from '../../services/termsData';
import {normalize} from '../../util/Normalize';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {WebView} from 'react-native-webview';
import {BASE_URL} from '../../services/api';
import {AuthContext} from '../../contexts/Auth';
import {LanguagesContext} from '../../contexts/Languages';
import Pdf from 'react-native-pdf';
import {
  policyDe,
  policyEn,
  policyEs,
  policyIt,
  policyPt,
} from '../../services/policyData';
import {
  aboutUsDe,
  aboutUsEn,
  aboutUsEs,
  aboutUsIt,
  aboutUsPt,
} from '../../services/aboutUsData';

export default function DrawerContainer({navigation}) {
  const [modalTermsUseVisible, setModalTermsUseVisible] = useState(false);
  const [modalPrivacyPolicyVisible, setModalPrivacyPolicyVisible] =
    useState(false);
  const [modalAboutUsVisible, setModalAboutUsVisible] = useState(false);
  let {logged, user, imageProfile, SiginOut, setLogged} =
    useContext(AuthContext);
  const {selectLanguage, language} = useContext(LanguagesContext);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const [userLogged, setUserLogged] = useState(user);
  const [terms, setTerms] = useState();
  const [policy, setPolicy] = useState();
  const [about, setAbout] = useState();

  useEffect(() => {
    (async () => {
      // console.log(logged, "logged")
      // console.log(userLogged?.username, user?.username, "AQUIDBSbds")
      console.log(language);
      if (language === 'pt-BR') {
        setTerms(termsPt);
        setPolicy(policyPt);
        setAbout(aboutUsPt);
      } else if (language === 'en-US') {
        setTerms(termsEn);
        setPolicy(policyEn);
        setAbout(aboutUsEn);
      } else if (language === 'it-IT') {
        setTerms(termsIt);
        setPolicy(policyIt);
        setAbout(aboutUsIt);
      } else if (language === 'es-ES') {
        setTerms(termsEs);
        setPolicy(policyEs);
        setAbout(aboutUsEs);
      } else if (language === 'de-DE') {
        setTerms(termsDe);
        setPolicy(policyDe);
        setAbout(aboutUsDe);
      }
      if (
        (userLogged === null || userLogged?.username != user?.username) &&
        logged === true
      ) {
        const user = JSON.parse(await AsyncStorage.getItem('@Donare:user'));
        // console.log(user, "***user***")
        setUserLogged(user);
      }
    })();
  }, [user, navigation]);

  function displayModalTermsUse(show) {
    setModalTermsUseVisible(show);
  }

  function displayModalPrivacyPolicy(show) {
    setModalPrivacyPolicyVisible(show);
  }

  function displayModalAboutUs(show) {
    setModalAboutUsVisible(show);
  }

  onShare = async () => {
    try {
      const result = await Share.share(
        Platform.OS === 'android'
          ? {
              title: 'Compartilhar Donare via',
              message:
                'Conheça o aplicativo Donare: https://play.google.com/store/apps/details?id=com.multiplica.donare',
              url: 'https://play.google.com/store/apps/details?id=com.multiplica.donare/',
            }
          : {
              title: 'Compartilhar Donare via',
              message:
                'Conheça o aplicativo Donare: https://apps.apple.com/br/app/donare/id1498420001',
              url: 'https://apps.apple.com/br/app/donare/id1498420001',
            },
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          alert('Compartilhar no ' + result.activityType);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const {width, height} = Dimensions.get('window');

  const HtmlReader = ({html}) => {
    return (
      <WebView
        allowFileAccess={true}
        originWhitelist={['*']}
        source={{html: html}}
        style={{
          flex: 1,
          height: height * 0.8,
          width: width * 1,
          padding: 10,
          marginBottom: 20,
        }}
        javaScriptEnabled={true}
        scrollEnabled={true}
      />
    );
  };

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={{marginBottom: 30, alignSelf: 'center'}}
            onPress={() => {
              navigation.navigate('Profile');
              navigation.closeDrawer();
            }}>
            {userLogged?.photo?.formats?.small?.url && !imageProfile ? (
              <Image
                style={styles.profilePhoto}
                source={{
                  uri: BASE_URL + userLogged?.photo?.formats?.small?.url,
                }}
              />
            ) : imageProfile ? (
              <Image
                style={styles.profilePhoto}
                source={{uri: BASE_URL + imageProfile.formats?.small?.url}}
              />
            ) : (
              <Image
                style={styles.profilePhoto}
                source={require('../../../assets/splash.png')}
              />
            )}
            <Text style={styles.profileName}>{userLogged?.username}</Text>
            <Text style={styles.editProfile}>
              {selectLanguage?.editProfile}
            </Text>
          </TouchableOpacity>
          <MenuButton
            title={selectLanguage?.adverts}
            source={require('../../../assets/icons/home.png')}
            onPress={() => {
              navigation.navigate('Home');
              navigation.closeDrawer();
            }}
          />

          <MenuButton
            title={selectLanguage?.myNotifications}
            source={require('../../../assets/icons/notification.png')}
            onPress={() => {
              navigation.navigate('Notifications', {user: userLogged});
              navigation.closeDrawer();
            }}
          />

          {userLogged?.type === 'person' ? (
            <MenuButton
              title={selectLanguage?.myMatches}
              source={require('../../../assets/icons/match.png')}
              onPress={() => {
                navigation.navigate('Matches', {user: userLogged});
                navigation.closeDrawer();
              }}
            />
          ) : null}

          <MenuButton
            title={selectLanguage?.myProducts}
            source={require('../../../assets/icons/package.png')}
            onPress={() => {
              navigation.navigate('MyProductsDonation', {user: userLogged});
              navigation.closeDrawer();
            }}
          />

          <MenuButton
            title={selectLanguage?.termsOfUse}
            source={require('../../../assets/icons/accept.png')}
            onPress={() => displayModalTermsUse(true)}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalTermsUseVisible}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFF',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#444444',
                  }}>
                  {selectLanguage?.termsOfUse}
                </Text>
              </View>
              <Pdf
                //file:///Users/stagetree/stageapps/donare/assets/pdf/termsOfUse.pdf
                trustAllCerts={false}
                source={{
                  uri: `data:application/pdf;base64,${terms}`,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}
              />
              <View
                style={{
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  alignContent: 'center',
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  padding: 10,
                }}>
                <TouchableOpacity
                  onPress={() => displayModalTermsUse(!modalTermsUseVisible)}
                  style={{
                    backgroundColor: '#F4AE38',
                    padding: 10,
                    width: 200,
                    borderRadius: 160,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#FFF',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {selectLanguage?.close}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <MenuButton
            title={selectLanguage?.policyOfPrivacy}
            source={require('../../../assets/icons/privacy-policy.png')}
            onPress={() => {
              displayModalPrivacyPolicy(true);
            }}
            style={{paddingRight: 10}}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalPrivacyPolicyVisible}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFF',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#444444',
                  }}>
                  {selectLanguage?.policyOfPrivacyText}
                </Text>
              </View>

              <Pdf
                //file:///Users/stagetree/stageapps/donare/assets/pdf/termsOfUse.pdf
                trustAllCerts={false}
                source={{
                  uri: `data:application/pdf;base64,${policy}`,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}
              />

              <View
                style={{
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  alignContent: 'center',
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  padding: 10,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    displayModalPrivacyPolicy(!modalPrivacyPolicyVisible)
                  }
                  style={{
                    backgroundColor: '#F4AE38',
                    padding: 10,
                    width: 200,
                    borderRadius: 160,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#FFF',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {selectLanguage?.close}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <MenuButton
            title={selectLanguage?.aboutUs}
            source={require('../../../assets/icons/info_us.png')}
            onPress={() => {
              displayModalAboutUs(true);
            }}
            style={{paddingRight: 10}}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalAboutUsVisible}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFF',
                alignItems: 'center',
                borderRadius: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 10,
                }}>
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#444444',
                  }}>
                  {selectLanguage?.aboutUsText}
                </Text>
              </View>

              <Pdf
                //file:///Users/stagetree/stageapps/donare/assets/pdf/termsOfUse.pdf
                trustAllCerts={false}
                source={{
                  uri: `data:application/pdf;base64,${about}`,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}
              />

              <View
                style={{
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  alignContent: 'center',
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  padding: 10,
                }}>
                <TouchableOpacity
                  onPress={() => displayModalAboutUs(!modalAboutUsVisible)}
                  style={{
                    backgroundColor: '#F4AE38',
                    padding: 10,
                    width: 200,
                    borderRadius: 160,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#FFF',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {selectLanguage?.close}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <MenuButton
            title={selectLanguage?.share}
            source={require('../../../assets/icons/share.png')}
            onPress={() => onShare()}
          />

          <MenuButton
            title={selectLanguage?.logout}
            source={require('../../../assets/icons/logout.png')}
            onPress={async () => {
              await SiginOut();
              setModalAboutUsVisible(false);
              setModalPrivacyPolicyVisible(false);
              setModalTermsUseVisible(false);
              setUserLogged(null);
              setLogged(false);
              navigation.navigate('Login');
              navigation.closeDrawer();
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};
