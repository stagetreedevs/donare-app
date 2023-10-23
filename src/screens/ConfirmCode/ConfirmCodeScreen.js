import React, { useState, useRef, createRef, useContext } from "react";
import {
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from "react-native-confirmation-code-field";

import api, { BASE_URL } from "../../services/api"
import { LanguagesContext } from "../../contexts/Languages";
import styles from "./styles";
import { customToast } from "../../util/FlashMessage";

export default function ConfirmCodeScreen({ navigation }) {
  const { selectLanguage } = useContext(LanguagesContext);
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const CELL_COUNT = 6;

  async function handleChangePassword() {
    // console.log("AQUI")
    setLoading(true);

    if (password === "") {
      customToast(selectLanguage?.messagePasswordEmpty, "error");
      setLoading(false);
      return;
    }
    else if (password !== confirmationPassword) {
      customToast(selectLanguage?.messagePasswordDifferent, "error");
      setLoading(false);
      return;
    }
    else if (password.length < 6) {
      customToast(selectLanguage?.messagePasswordLength, "error");
      setLoading(false);
      return;
    }
    else {
      await api.post("/password/reset-password", {
        "code": value,
        "password": password
    }).then(async (response) => {
        // console.log(response.data);
        customToast(selectLanguage?.messageSucessCode, "success");
        navigation.navigate("Login");
      }).catch((err) => {
        // console.log(err, "ERROR")
        customToast(selectLanguage?.messageErrorCode, "error");
        setLoading(false);
      });
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
        <View
          style={{
            justifyContent: "center",
            flex: 1,
            width: "85%",
            alignSelf: "center",
          }}
        >

          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can"t paste a text value, because context menu doesn"t appear
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />

        </View>

        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.password}
            autoCorrect={false}
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc" 
          />

          <TextInput
            style={styles.input}
            placeholder={selectLanguage?.confirmPassword}
            autoCorrect={false}
            value={confirmationPassword}
            onChangeText={(confirmationPassword) => setConfirmationPassword(confirmationPassword)}
            secureTextEntry={hidePassword}
            placeholderTextColor="#ccc" 
          />

          <TouchableOpacity onPress={() => handleChangePassword()} style={styles.buttonCreateAccount}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.textCreateAccount}>{selectLanguage?.changePassword}</Text>
            )}
          </TouchableOpacity>
            
          <TouchableOpacity
              style={styles.buttonReturnLogin}
              onPress={() => navigation.navigate("Login")}
            >
          <View style={styles.viewReturnLogin}>
            <Text
              style={styles.textReturnLogin}
            >
              {selectLanguage?.backTheScreen}
            </Text>
          </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
