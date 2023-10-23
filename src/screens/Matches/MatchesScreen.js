import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, Button, Paragraph, ActivityIndicator } from "react-native-paper";
import { BASE_URL } from "../../services/api"
import api from "../../services/api";
import { LanguagesContext } from '../../contexts/Languages';
import { customToast } from "../../util";

import styles from "./styles";

export default function MatchesScreen({ navigation }) {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectLanguage } = useContext(LanguagesContext);
  const user = navigation.getParam("user");

  useEffect(() => {
    getMyMatches()
  }, [navigation]);

  const getMyMatches = async () => {
    setLoading(true)
    await api.post(`/matches/get-my-matches`).then(response => {
      setMatches(response.data);
      // console.log(response.data, "GET MY MATCHES")
      setLoading(false);
    }).catch(error => {
      // console.log(error, "ERROR")
      customToast(selectLanguage?.messageErrorLoadingProducts, "danger");
      setLoading(false);
    });
  }

  const handleUpdateProduct = async (is_product_donor, match) => {

    if (is_product_donor) {
      if (match.product_trocatroca_receiver.status === "in_progress" && match.status_user_receiver === "in_progress") {
        console.log(1)
        await api.put(`/product-trocatrocas/${match.product_trocatroca_donor.id}`, {
          status: "waiting"
        }).then(async (response) => {
          customToast(selectLanguage?.messageWaitingForTheOtherUser, "info");
          setLoading(false);
        }).catch(error => {
          console.log(error);
          setLoading(false);
          customToast(selectLanguage?.messageErrorProductUpdate, "error");
        })
      }
      else if (match.product_trocatroca_receiver.status === "waiting") {
        console.log(2)
        await api.put(`/product-trocatrocas/${match.product_trocatroca_donor.id}`, {
          status: "complete"
        }).then(async (response) => {
          await api.put(`/product-trocatrocas/${match.product_trocatroca_receiver.id}`, {
            status: "complete"
          }).then(async (response) => {
            customToast(selectLanguage?.messageExchangeSuccess, "success");
            setLoading(false);
          }).catch(error => {
            console.log(error);
            setLoading(false);
            customToast(selectLanguage?.messageErrorProductUpdate, "error");
          })
        }).catch(error => {
          console.log(error);
          setLoading(false);
          customToast(selectLanguage?.messageErrorProductUpdate, "error");
        })
      }
      else {
        console.log(3)
        await api.put(`/product-trocatrocas/${match.product_trocatroca_donor.id}`, {
          status: "in_progress"
        }).then(async (response) => {
          await api.put(`/product-trocatrocas/${match.product_trocatroca_receiver.id}`, {
            status: "in_progress"
          }).then(async (response) => {
            customToast(selectLanguage?.messageProductNotExchange, "info");
            setLoading(false);
          }).catch(error => {
            console.log(error);
            setLoading(false);
            customToast(selectLanguage?.messageErrorProductUpdate, "error");
          })
        }).catch(error => {
          console.log(error);
          setLoading(false);
          customToast(selectLanguage?.messageErrorProductUpdate, "error");
        })
      }
    }
    else {
      if (match.product_trocatroca_donor.status === "in_progress" && match.status_user_donor === "in_progress") {
        console.log(4)
        await api.put(`/product-trocatrocas/${match.product_trocatroca_receiver.id}`, {
          status: "waiting"
        }).then(async (response) => {
          customToast(selectLanguage?.messageWaitingForTheOtherUser, "info");
          setLoading(false);
        }).catch(error => {
          console.log(error);
          setLoading(false);
          customToast(selectLanguage?.messageErrorProductUpdate, "error");
        })
      }
      else if (match.product_trocatroca_donor.status === "waiting") {
        console.log(5)
        await api.put(`/product-trocatrocas/${match.product_trocatroca_receiver.id}`, {
          status: "complete"
        }).then(async (response) => {
          await api.put(`/product-trocatrocas/${match.product_trocatroca_donor.id}`, {
            status: "complete"
          }).then(async (response) => {
            customToast(selectLanguage?.messageExchangeSuccess, "success");
            setLoading(false);
          }).catch(error => {
            console.log(error);
            setLoading(false);
            customToast(selectLanguage?.messageErrorProductUpdate, "error");
          })
        }).catch(error => {
          console.log(error);
          setLoading(false);
          customToast(selectLanguage?.messageErrorProductUpdate, "error");
        })
      }
      else {
        console.log(6)
        await api.put(`/product-trocatrocas/${match.product_trocatroca_receiver.id}`, {
          status: "in_progress"
        }).then(async (response) => {
          await api.put(`/product-trocatrocas/${match.product_trocatroca_donor.id}`, {
            status: "in_progress"
          }).then(async (response) => {
            customToast(selectLanguage?.messageProductNotExchange, "info");
            setLoading(false);
          }).catch(error => {
            console.log(error);
            setLoading(false);
            customToast(selectLanguage?.messageErrorProductUpdate, "error");
          })
        }).catch(error => {
          console.log(error);
          setLoading(false);
          customToast(selectLanguage?.messageErrorProductUpdate, "error");
        })
      }
    }
  }

  const handleUpdateActiveProduct = async (match) => {
    await api.put(`/product-trocatrocas/${match.product_trocatroca_receiver.id}`, {
      status: "in_progress"
    }).then(async (response) => {
      await api.put(`/product-trocatrocas/${match.product_trocatroca_donor.id}`, {
        status: "in_progress"
      }).then(async (response) => {
        customToast(selectLanguage?.messageProductNotExchange, "info");
        setLoading(false);
      }).catch(error => {
        console.log(error);
        setLoading(false);
        customToast(selectLanguage?.messageErrorProductUpdate, "error");
      })
    }).catch(error => {
      console.log(error);
      setLoading(false);
      customToast(selectLanguage?.messageErrorProductUpdate, "error");
    })
  }

  const handleUpdateMatch = async (accept, match) => {
    Alert.alert(
      selectLanguage?.confirm,
      `${selectLanguage?.messageTheProduct}${!accept ? "não" : " "}${selectLanguage?.wasChanged}`,
      [
        {
          text: selectLanguage?.cancel,
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: selectLanguage?.confirm,
          onPress: async () => {
            setLoading(true);
            await api.put(`/matches/${match.id}`, user.id === match.user_donor.id ?
              {
                status_user_donor: accept ? "accepted" : "rejected"
              }
              : {
                status_user_receiver: accept ? "accepted" : "rejected"
              }
            ).then(async (response) => {

              // console.log(accept, user.id, match.user_donor.id, match.user_receiver.id, response.data.product_trocatroca_donor.id, response.data.product_trocatroca_receiver.id, response.data.product_trocatroca_donor.status, response.data.product_trocatroca_donor.status , "RESPONSE")
              // console.log(response.data.product_trocatroca_receiver)
              accept && user.id === match.user_donor.id ?
                handleUpdateProduct(true, response.data)
                :
                accept && user.id === match.user_receiver.id ?
                  handleUpdateProduct(false, response.data)
                  :
                  !accept ?
                    handleUpdateActiveProduct(response.data)
                    :
                    customToast(selectLanguage?.waitingTheOtherUser, "info")

              getMyMatches()

            }).catch(error => {
              setLoading(false);
              console.log(error);
              customToast(selectLanguage?.messageErrorUpdateNotification, "error");
            });
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={{ backgroundColor: "#EDEDED", }}>
      {loading ? (
        <ActivityIndicator size="large" color="#F4AE38" style={{ marginTop: 10 }} />
      ) : (
        <View style={styles.background}>
          {matches && matches.length > 0 ?
            matches.map((match, index) => (
              <View style={styles.container}>

                {/* {console.log(match.user_donor.id, match.user_receiver.id, user.id, "AQUI")} */}
                <TouchableOpacity onPress={() => console.log("VER PRODUTO")}>
                  <Card>
                    <View style={styles.products}>
                      {!match.product_trocatroca_donor.photos[0] ? (
                        <Image style={[styles.image, { marginLeft: 6 }]} source={require("../../../assets/donaremoney.jpeg")} />
                      ) : (
                        <Image
                          style={[styles.image, { marginLeft: 6 }]}
                          source={{
                            uri: BASE_URL + (match.product_trocatroca_donor?.photos[0]?.formats?.small?.url),
                          }}
                        />
                      )}
                      {!match.product_trocatroca_receiver.photos[0] ? (
                        <Image style={[styles.image, { marginLeft: 6 }]} source={require("../../../assets/donaremoney.jpeg")} />
                      ) : (
                        <Image
                          style={[styles.image, { marginLeft: 6 }]}
                          source={{
                            uri: BASE_URL + (match.product_trocatroca_receiver?.photos[0]?.formats?.small?.url),
                          }}
                        />
                      )}
                    </View>
                    <Paragraph style={styles.paragraph}>
                      {selectLanguage?.yourProduct} {user.id === match?.user_donor.id ? match.product_trocatroca_donor?.name : match.product_trocatroca_receiver?.name}
                    </Paragraph>

                    <Paragraph style={[styles.paragraph, {color: "#F4AE38"}]}>
                      {selectLanguage?.acceptExchangeProduct} {user.id !== match?.user_donor.id ? match?.product_trocatroca_donor?.name : match?.product_trocatroca_receiver?.name}?
                    </Paragraph>
                    {
                      match.user_donor.id === user.id && match.status_user_donor === "in_progress" ? (
                        <>
                          <Paragraph style={styles.paragraph}>
                            {selectLanguage?.hasYourAdBeenVisited}
                          </Paragraph>
                          <Card.Actions style={{ flexDirection: "column" }}>
                            <Button onPress={() => { handleUpdateMatch(true, match) }}>{selectLanguage?.YESREMOVEAD}</Button>
                            <Button onPress={() => { handleUpdateMatch(false, match) }}>{selectLanguage?.NOREMOVEAD}</Button>
                          </Card.Actions>
                        </>
                      ) :
                        match.user_receiver.id === user.id && match.status_user_receiver === "in_progress" ? (
                          <>
                            <Paragraph style={styles.paragraph}>
                              {selectLanguage?.hasYourAdBeenVisited}
                            </Paragraph>
                            <Card.Actions style={{ flexDirection: "column" }}>
                              <Button onPress={() => { handleUpdateMatch(true, match) }}>{selectLanguage?.YESREMOVEAD}</Button>
                              <Button onPress={() => { handleUpdateMatch(false, match) }}>{selectLanguage?.NOREMOVEAD}</Button>
                            </Card.Actions>
                          </>
                        ) : (
                          match.status_user_donor === "accepted" && match.status_user_receiver === "accepted" ? (
                            <Card.Actions>
                              <Paragraph style={styles.accept}>
                                {selectLanguage?.ACCEPTED}
                              </Paragraph>
                            </Card.Actions>
                          ) : match.user_donor.id === user.id && match.status_user_donor === "rejected" ? (
                            <Card.Actions>
                              <Paragraph style={styles.refuse}>
                                {selectLanguage?.YOUREFUSED}
                              </Paragraph>
                            </Card.Actions>
                          ) : match.user_donor.id === user.id && match.status_user_donor === "accepted" && match.status_user_receiver === "rejected" ? (
                            <Card.Actions>
                              <Paragraph style={styles.refuse}>
                                {selectLanguage?.THEEXCHANGEWASREFUSEDBYTHEOTHERUSER}
                              </Paragraph>
                            </Card.Actions>
                          ) : match.user_receiver.id === user.id && match.status_user_receiver === "rejected" ? (
                            <Card.Actions>
                              <Paragraph style={styles.refuse}>
                                {selectLanguage?.YOUREFUSED}
                              </Paragraph>
                            </Card.Actions>
                          ) : match.user_receiver.id === user.id && match.status_user_donor === "rejected" && match.status_user_receiver === "accepted" ? (
                            <Card.Actions>
                              <Paragraph style={styles.refuse}>
                                {selectLanguage?.THEEXCHANGEWASREFUSEDBYTHEOTHERUSER}
                              </Paragraph>
                            </Card.Actions>
                          ) :
                            match.user_donor.id === user.id && match.status_user_donor === "in_progress" ? (
                              <Card.Actions>
                                <Paragraph style={styles.refuse}>
                                  {selectLanguage?.THEEXCHANGEWASREFUSED}
                                </Paragraph>
                              </Card.Actions>
                            ) :
                              match.user_receiver.id === user.id && match.status_user_donor === "in_progress" ? (
                                <Card.Actions>
                                  <Paragraph style={styles.waiting}>
                                    {selectLanguage?.WAITINGFORTHEOTHERUSER}
                                  </Paragraph>
                                </Card.Actions>
                              ) :
                                match.user_donor.id === user.id && match.status_user_receiver === "in_progress" ? (
                                  <Card.Actions>
                                    <Paragraph style={styles.waiting}>
                                      {selectLanguage?.WAITINGFORTHEOTHERUSER}
                                    </Paragraph>
                                  </Card.Actions>
                                ) :
                                  (
                                    <Card.Actions>
                                      <Paragraph style={styles.waiting}>
                                        {selectLanguage?.WAITING}
                                      </Paragraph>
                                    </Card.Actions>
                                  )
                        )}
                  </Card>
                </TouchableOpacity>
              </View>
            )) : (
              <View style={styles.container}>
                <Text style={styles.text}>
                  {selectLanguage?.youdonthaveanyproductsinreturn}
                </Text>
              </View>
            )}
        </View>
      )}
    </ScrollView>
  );
}
