import React, {useEffect, useState, useContext} from 'react';
import {SafeAreaView, ScrollView, View, Image, Text, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Card, Button, Paragraph, ActivityIndicator} from 'react-native-paper';
import {BASE_URL} from '../../services/api';
import api from '../../services/api';
import {LanguagesContext} from '../../contexts/Languages';
import {customToast, normalize} from '../../util';

import styles from './styles';

export default function MyProductsDonationScreen({navigation}) {
  const [products, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const {selectLanguage} = useContext(LanguagesContext);

  const user = navigation.getParam('user');

  useEffect(() => {
    getMyProductsDonation();
  }, [navigation]);

  const getMyProductsDonation = async () => {
    setLoading(true);
    await api
      .post('/products/get-product-by-user')
      .then(response => {
        setMyProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        customToast(selectLanguage?.messageErrorGetNotifications, 'error');
        navigation.navigate('Home');
        setLoading(false);
      });
  };

  return (
    <ScrollView style={{backgroundColor: '#EDEDED'}}>
      <View style={styles.background}>
        {loading ? (
          <ActivityIndicator size="large" color="#F4AE38" />
        ) : (
          products.map(product => {
            if(product?.status === "cancelled"){
              return
            }
            return(
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Recipe', {
                    item: product,
                    backScreen: false,
                    user,
                    goHome: false,
                  })
                }>
                <Card style={{paddingTop: 16}}>
                  <View style={styles.products}>
                    {!product?.photos[0] ? (
                      <Image
                        style={styles.image}
                        source={require('../../../assets/donaremoney.jpeg')}
                      />
                    ) : (
                      <Image
                        style={styles.image}
                        source={{
                          uri:
                            BASE_URL + product.photos[0]?.formats?.small?.url,
                        }}
                      />
                    )}
                  </View>
                  <Paragraph
                    style={{
                      color: '#FFA000',
                      fontSize: normalize(12),
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    {product?.name}
                  </Paragraph>
                  <Paragraph
                    style={{
                      color: '#b1b1b1',
                      fontSize: normalize(14),
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginTop: 10,
                    }}>
                    {product?.type == 'trocatroca'
                      ? selectLanguage?.trocaTroca
                      : product?.type == 'doacoes'
                      ? selectLanguage?.donation
                      : product?.type == 'servicos'
                      ? selectLanguage?.services
                      : product?.type == 'servico'
                      ? selectLanguage?.service
                      : product?.type == 'dinheiro'
                      ? selectLanguage?.donationOfMoney
                      : selectLanguage?.others}
                  </Paragraph>
                  <>
                    {product?.status === 'in_progress' ? (
                      <Card.Actions>
                        <Paragraph style={styles.waiting}>
                          {selectLanguage?.WAITING}
                        </Paragraph>
                      </Card.Actions>
                    ) : product?.status === 'complete' &&
                      product?.type !== 'servico' &&
                      product?.type !== 'dinheiro' ? (
                      <>
                        <Card.Actions>
                          <Paragraph style={styles.accept}>
                            {selectLanguage?.DONATED}
                          </Paragraph>
                        </Card.Actions>
                      </>
                    ) : product?.status === 'complete' &&
                      (product?.type === 'servico' ||
                        product?.type === 'dinheiro') ? (
                      <>
                        <Card.Actions>
                          <Paragraph style={styles.accept}>
                            {selectLanguage?.FINISHED}
                          </Paragraph>
                        </Card.Actions>
                      </>
                    ) : product?.status === 'cancelled' ? (
                      <Card.Actions>
                        <Paragraph style={styles.refuse}></Paragraph>
                      </Card.Actions>
                    ) : null}
                  </>
                </Card>
              </TouchableOpacity>
            </View>
          )})
        )}
      </View>
    </ScrollView>
  );
}
