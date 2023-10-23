import React, { useEffect, useState, useContext } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  Alert,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card, Button, Paragraph, ActivityIndicator } from 'react-native-paper';
import { BASE_URL } from '../../services/api'
import api from '../../services/api';
import { LanguagesContext } from '../../contexts/Languages';
import { customToast } from '../../util';

import styles from './styles';

export default function NotificationsUserScreen({ navigation }) {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectLanguage } = useContext(LanguagesContext);

  const user = navigation.getParam('user');

  useEffect(() => {
    getNotifications();
  }, [navigation]);

  const getNotifications = async () => {
    setLoading(true);
    await api.get('/notifications').then(response => {
      setNotifications(response.data);
      setLoading(false);
    }).catch(error => {
      // console.log(error);
      customToast(selectLanguage?.messageErrorGetNotifications, 'error');
      navigation.navigate('Home');
      setLoading(false);
    });
  }

  const handleUpdateProduct = async (accept, notification) => {

    let selectedProduct = ["product_error", "product_error"];

    notification.product_donation ?
      selectedProduct = ["products", "product_donation"] :
      notification.product_service ? selectedProduct[0] = "product_service" :
        notification.product_trocatroca ? selectedProduct[0] = "product_trocatroca" :
          selectedProduct[0] = "product_error";

    // console.log(`/${selectedProduct}/${notification?.[selectedProduct].id}`)

    await api.put(`/${selectedProduct[0]}/${notification?.[selectedProduct[1]].id}`, {
      status: accept ? 'complete' : 'in_progress',
    }).then(response => {
      getNotifications();
      customToast(selectLanguage?.messageSuccessGetNotifications, 'success');
    }).catch(error => {
      console.log(error);
      setLoading(false);
      customToast(selectLanguage?.messageErrorProductUpdate, 'error');
    })
  }

  const handleUpdateDonationPerson = async (accept, notification) => {
    Alert.alert(
      selectLanguage?.confirm,
      `${selectLanguage?.messageTheProduct} ${!accept ? 'não' : ''} ${selectLanguage?.messageIsDonate}`,
      [
        {
          text: selectLanguage?.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: selectLanguage?.confirm,
          onPress: async () => {
            setLoading(true);
            await api.put(`/donations/${notification.donation.id}`, {
              status: accept ? 'accepted' : 'rejected'
            }).then(response => {
              handleUpdateProduct(accept, notification)
            }).catch(error => {
              setLoading(false);
              console.log(error);
              customToast(selectLanguage?.messageErrorUpdateNotification, 'error');
            });
          }
        }
      ]
    )
  }

  const handleUpdateDonationCompany = async (notification) => {
    // console.log(notification, "AQUI")
    Alert.alert(
      selectLanguage?.confirm,
      selectLanguage?.messageTheAnouncementIsDesactived,
      [
        {
          text: selectLanguage?.cancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: selectLanguage?.confirm,
          onPress: async () => {
            console.log("adsh")
            setLoading(true);
            console.log(notification.donation.id, "AQUI")
            await api.put(`/donations/${notification.donation.id}`, {
              status: 'accepted'
            }).then(async (response) => {
              await api.put(`/product-institutions/${notification?.product_institution.id}`, {
                status: 'complete'
              }).then(response => {
                getNotifications();
                customToast(selectLanguage?.messageSuccessGetNotifications, 'success');
              }).catch(error => {
                console.log(error);
                setLoading(false);
                customToast(selectLanguage?.messageErrorProductUpdate, 'error');
              })
            }).catch(error => {
              console.log(error);
              setLoading(false);
              customToast(selectLanguage?.messageErrorUpdateNotification, 'error');
            })
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={{ backgroundColor: "#EDEDED", }}>
      <View style={styles.background}>
        {loading ? (
          <ActivityIndicator size="large" color="#F4AE38" />
        ) : (
          notifications.map(notification => {
            if (notification?.donation?.status === 'rejected'){
              return
            }
            return(
            <View style={styles.container}>
              <Card>
                {
                  notification.donation?.user_donor === user?.id && user?.type === 'person' && !notification?.donation?.product_institution && !notification?.product_service ? (
                    <Paragraph style={styles.paragraph}>
                      {selectLanguage?.IWANTTODONATE}
                    </Paragraph>
                  ) : notification.donation?.user_receiver === user?.id && user?.type === 'person' && !notification?.donation?.product_institution && !notification?.product_service ? (
                    <Paragraph style={styles.paragraph}>
                      {selectLanguage?.IWANTTORECEIVE}
                    </Paragraph>
                  ) : notification.donation?.user_donor === user?.id && user?.type === 'person' && !notification?.donation?.product_institution && notification?.product_service ? (
                    <Paragraph style={styles.paragraph}>
                      {selectLanguage?.SERVICE}
                    </Paragraph>
                  ) : notification.donation?.user_receiver === user?.id && user?.type === 'person' && notification?.donation?.product_institution ? (
                    <Paragraph style={styles.paragraph}>
                      {selectLanguage?.INSTITUTION}
                    </Paragraph>
                  ) : (
                    <Paragraph style={styles.paragraph}>
                      {selectLanguage?.ANNOUNCEMENT}
                    </Paragraph>
                  )
                }
                <TouchableOpacity onPress={() => console.log("VER PRODUTO")}>
                  <View style={styles.products}>
                    {notification?.product_donation?.photos?.length === undefined || notification?.product_donation?.photos?.length === 0
                      && notification?.product_service?.photos?.length === undefined || notification?.product_service?.photos?.length === 0
                      && notification?.product_trocatroca?.photos?.length === undefined || notification?.product_trocatroca?.photos?.length === 0
                      && notification?.product_institution?.photos?.length === undefined || notification?.product_institution?.photos?.length === 0 ? (
                      <Image style={styles.image} source={require('../../../assets/donaremoney.jpeg')} />
                    ) : (
                      <Image
                        style={styles.image}
                        source={{
                          uri: BASE_URL + (notification?.product_donation?.photos[0] ? notification?.product_donation?.photos[0]?.formats?.small?.url :
                            notification?.product_service?.photos[0] ? notification?.product_service?.photos[0]?.formats?.small?.url :
                              notification?.product_trocatroca?.photos[0] ? notification?.product_trocatroca?.photos[0]?.formats?.small?.url :
                                notification?.product_institution?.photos[0]?.formats?.small?.url)
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                <Paragraph style={{ color: '#FFA000', fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>
                  {notification?.product_donation?.name}
                  {notification?.product_institution?.name}
                  {notification?.product_service?.name}
                  {notification?.product_trocatroca?.name}
                </Paragraph>
                {/* {console.log(notification.user_donor.id, user.id, "MIMIMI")} */}
                {notification.user_donor.id === user?.id && notification?.donation?.status === 'in_progress' ? (
                  <>
                    <Paragraph style={styles.paragraph}>
                      {notification.user_donor.type === 'company' ? selectLanguage?.adDeactivated : selectLanguage?.adDeactivatedMessage}
                    </Paragraph>
                    <Card.Actions style={{ flexDirection: 'column' }}>
                      {notification.user_donor.type === 'person' ? (
                        <>
                          <Button style={styles.accept} onPress={() => { handleUpdateDonationPerson(true, notification) }}>{selectLanguage?.YESDESACTIVE}</Button>
                          <Button style={styles.refuse} onPress={() => { handleUpdateDonationPerson(false, notification) }}>{selectLanguage?.NODESACTIVE}</Button>
                        </>
                      ) : (
                        <Button style={styles.accept} onPress={() => { handleUpdateDonationCompany(notification) }}>{selectLanguage?.YESDESACTIVE}</Button>
                      )}
                    </Card.Actions>
                  </>
                ) : (
                  <>
                    {notification.donation?.user_donor !== user?.id && notification?.donation?.status == 'in_progress' && !notification?.donation?.product_institution && user?.type === 'person' ? (
                      <Card.Actions>
                        <Paragraph style={styles.waiting}>
                          {selectLanguage?.WAITING}
                        </Paragraph>
                      </Card.Actions>
                    ) : notification?.donation?.user_donor === user?.id && notification?.donation?.status === 'accepted' && user?.type === 'person' && notification?.donation?.product_institution && notification?.product_service ? (
                      <>
                        <Card.Actions>
                          <Paragraph style={styles.accept}>
                            {selectLanguage?.DIDYOUPERFORMTHISSERVICE}
                          </Paragraph>
                        </Card.Actions>
                      </>
                    ) : notification?.donation?.user_donor !== user?.id && notification?.donation?.status === 'accepted' && user?.type === 'person' && !notification?.donation?.product_institution && notification?.product_service ? (
                      <Card.Actions>
                        <Paragraph style={styles.accept}>
                          {selectLanguage?.YOURECEIVEDTHISSERVICE}
                        </Paragraph>
                      </Card.Actions>
                    ) : notification?.donation?.status === 'rejected' && user?.type === 'person' && notification?.product_service ? (
                      <Card.Actions>
                        <Paragraph style={styles.refuse}>
                          {selectLanguage?.SERVICEREFUSED}
                        </Paragraph>
                      </Card.Actions>
                    ) : notification?.donation?.user_donor === user?.id && notification?.donation?.status === 'accepted' && user?.type === 'person' && notification?.donation?.product_institution ? (
                      <>
                        <Card.Actions>
                          <Paragraph style={styles.accept}>
                            {selectLanguage?.DONATED}
                          </Paragraph>
                        </Card.Actions>
                      </>
                    ) : notification?.donation?.user_donor !== user?.id && notification?.donation?.status === 'accepted' && user?.type === 'person' && !notification?.donation?.product_institution ? (
                      <Card.Actions>
                        <Paragraph style={styles.accept}>
                          {selectLanguage?.RECEIVED}
                        </Paragraph>
                      </Card.Actions>
                    ) : notification?.donation?.status === 'rejected' && user?.type === 'person' ? (
                      <Card.Actions>
                        <Paragraph style={styles.refuse}>
                        </Paragraph>
                      </Card.Actions>
                    ) :
                      notification?.donation?.user_donor === user?.id && notification?.donation?.status === 'accepted' && user?.type === 'company' ? (
                        <>
                          <Card.Actions>
                            <Paragraph style={styles.accept}>
                              {selectLanguage?.FINISHED}
                            </Paragraph>
                          </Card.Actions>
                        </>
                      ) :
                        notification.donation?.user_donor !== user?.id && notification?.donation?.product_institution ? (
                          <Card.Actions>
                            <Paragraph style={styles.accept}>
                              {selectLanguage?.ACCEPTED}
                            </Paragraph>
                          </Card.Actions>
                        ) : null
                    }
                  </>
                )}
              </Card>
            </View>
          )}))
        }
      </View>
    </ScrollView >
  );
}
