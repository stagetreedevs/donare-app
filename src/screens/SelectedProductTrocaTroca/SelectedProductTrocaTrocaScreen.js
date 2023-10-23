import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  Alert,
  Linking,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, Button, Paragraph, ActivityIndicator } from "react-native-paper";
import { BASE_URL } from "../../services/api"
import api from "../../services/api";
import { LanguagesContext } from "../../contexts/Languages";
import { customToast } from "../../util";

import styles from "./styles";

export default function SelectedProductTrocaTrocaScreen({ navigation }) {

  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [products, setProducts] = useState([]);
  const { selectLanguage } = useContext(LanguagesContext);
  const item = navigation.getParam("item");
  const user = navigation.getParam("user");

  useEffect(() => {
    getMyProducts()
  }, []);

  const getMyProducts = async () => {
    setLoading(true);
    await api.post(`/product-trocatrocas/get-my-products`).then(response => {
      setProducts(response.data);
      setLoading(false);
    }).catch(error => {
      customToast(selectLanguage?.messageErrorLoadingProducts, "danger");
      setLoading(false);
    });
  }

  const handleSelectedProduct = (product) => {
    setLoadingPage(true);
    api.post(`/matches/`, {
      product_trocatroca_donor: item.id,
      product_trocatroca_receiver: product.id,
      user_donor: item?.user?.id,
      user_receiver: product.user.id,
    }).then(response => {
      customToast(selectLanguage?.waitYouWillContactTheUser, "info");
      sendWhatsapp();
      setLoadingPage(false);
      navigation.navigate("Home");
      navigation.navigate("Matches", { user });
    }).catch(error => {
      console.log(error, "ERROR")
      customToast(selectLanguage?.messageErrorSelectProduct, "danger");
      setLoadingPage(false);
    });
  }

  const sendWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?phone=${item.user.phone}${selectLanguage?.messageWhatsAppContact1}${item.name}${selectLanguage?.messageWhatsAppContact2}`;
    Linking.openURL(url);
  }

  return (
    <ScrollView style={{ backgroundColor: "#EDEDED" }}>
      {loadingPage ?
        <ActivityIndicator size="large" color="#FFA000" style={{ marginTop: 10 }} />
        : (
          <>
            <Text style={styles.titleDoacoes}>{selectLanguage?.productSelecionadoToReceive}</Text>
            <View style={styles.backgroundContainer}>
              <Card style={{ paddingVertical: 14 }}>
                <View style={styles.products}>
                  {!item?.photos[0] ? (
                    <Image style={{
                      width: 100,
                      height: 100, alignSelf: "center"
                    }} source={require("../../../assets/donaremoney.jpeg")} />
                  ) : (
                    <Image
                      style={{
                        width: 100,
                        height: 100, alignSelf: "center"
                      }}
                      source={{
                        uri: BASE_URL + item?.photos[0]?.formats?.small?.url
                      }}
                    />
                  )}
                </View>
                {/* </TouchableOpacity> */}
                <Paragraph style={{ color: "#FFA000", fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
                  {item?.name}
                </Paragraph>
              </Card>
            </View>

            <Text style={styles.titleDoacoes}>{selectLanguage?.yourExchangeAds}</Text>
            <View style={styles.backgroundContainer}>
              {loading ? (
                <ActivityIndicator size="large" color="#F4AE38" />
              ) : (
                products.length > 0 ? (
                  products.map(product => (
                    <View style={styles.container}>
                      <TouchableOpacity onPress={() => {
                        Alert.alert(
                          selectLanguage?.confirm,
                          `${selectLanguage?.selectThisProductToBeExchangedWith}${product.name}?`,
                          [
                            {
                              text: selectLanguage?.cancel,
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel",
                            },
                            {
                              text: selectLanguage?.confirm,
                              onPress: async () => {
                                handleSelectedProduct(product);
                              }
                            }
                          ]
                        )
                      }}>
                        <Card style={{ paddingVertical: 14 }}>
                          {/* <TouchableOpacity onPress={() => console.log("VER PRODUTO")}> */}
                          <View style={styles.products}>
                            {!product?.photos[0] ? (
                              <Image style={styles.image} source={require("../../../assets/donaremoney.jpeg")} />
                            ) : (
                              <Image
                                style={styles.image}
                                source={{
                                  uri: BASE_URL + product?.photos[0]?.formats?.small?.url
                                }}
                              />
                            )}
                          </View>
                          {/* </TouchableOpacity> */}
                          <Paragraph style={{ color: "#FFA000", fontWeight: "bold", textAlign: "center", marginTop: 10 }}>
                            {product?.name}
                          </Paragraph>
                        </Card>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.container}>
                    <Text style={styles.text}>{selectLanguage?.withouProductToTroca}</Text>
                  </View>
                ))}
            </View>
          </>
        )}
    </ScrollView >
  );
}
