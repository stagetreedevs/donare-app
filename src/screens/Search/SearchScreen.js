import React from 'react';
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import styles from './styles';
import { ListItem, SearchBar } from 'react-native-elements';
import MenuImage from '../../components/MenuImage/MenuImage';

export default function SearchScreen({ navigation }) {

  console.log(navigation?.state?.params?.type, 'SearchScreen');

  const [search, setSearch] = React.useState('');

  return (
    <>
      <View style={{ backgroundColor: '#fff', flex: 1 }}>
        <SearchBar
          containerStyle={{
            backgroundColor: '#fff',
            borderBottomColor: '#fff',
            borderTopColor: '#fff',
            width: '90%',
            alignSelf: 'center',
            marginTop: 10,
          }}
          inputContainerStyle={{
            backgroundColor: '#EDEDED'
          }}
          inputStyle={{
            backgroundColor: '#EDEDED',
            borderRadius: 10,
            color: 'black'
          }}
          searchIcond
          clearIcon
          editable={true}
          //lightTheme
          round
          onChangeText={text => setSearch(text)}
          placeholder="Buscar"
          value={search}
        />
        <TouchableOpacity style={styles.button} onPress={() => {
          { auxSelectedCategory == 'doacoes' ? handleProductDonation(location?.coords?.latitude, location?.coords?.longitude) : auxSelectedCategory == 'servicos' ? handleProductService(location?.coords?.latitude, location?.coords?.longitude) : auxSelectedCategory == 'instituicoes' ? handleProductInstitutionsShowPerson(location?.coords?.latitude, location?.coords?.longitude) : handleProductTrocatroca(location?.coords?.latitude, location?.coords?.longitude) }
        }}>
          <Text style={{ color: '#FFF', textAlign: 'center' }}>CONFIRMAR</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

