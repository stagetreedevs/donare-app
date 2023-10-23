import React, { useState, useContext } from "react";
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { customToast } from "../../util/FlashMessage";
import api, { BASE_URL } from "../../services/api";
import { LanguagesContext } from "../../contexts/Languages";

import styles from "./styles";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { selectLanguage } = useContext(LanguagesContext);

  async function handleForgotPassword() {
    setLoading(true);
    if (email.length !== 0) {
      api.post("/password/send-reset-email", {
        identifier: email
      }).then(() => {
        customToast(selectLanguage?.messageEmailSent, "success");
        navigation.navigate("ConfirmCode");
      }).catch(() => {
        customToast(selectLanguage?.messageErrorEmailSent, "error");
      }).finally(() => {
        setLoading(false);
      })
    }
    else {
      customToast(selectLanguage?.messageInputEmail, "error");
    }
  }

  return (
    <SafeAreaView style={styles.background}>

      <ScrollView
        style={{ width: "95%", marginTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerLogo}>
          <Image
            style={styles.logo}
            source={require("../../../assets/logoDonare.png")}
          />
        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.email}
            autoCorrect={false}
            onChangeText={(email) => { setEmail(email) }}
            placeholderTextColor="#ccc" 
          />

          <TouchableOpacity style={styles.buttonForgotPassword} onPress={() => {
            handleForgotPassword()
          }}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.textForgotPassword}>Enviar</Text>}
          </TouchableOpacity>

          <View style={styles.viewReturnLogin}>
            <Text
              style={{ fontSize: 14, color: "#808080", marginTop: 30, paddingRight: 10 }}
            >
              {selectLanguage?.backTheScreen}
            </Text>

            <TouchableOpacity
              style={styles.buttonReturnLogin}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.textReturnLogin}>{selectLanguage?.enterAccount}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

