import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { RadioButton, Searchbar } from 'react-native-paper';
import { normalize } from '../../util';
import styles from './styles';

export default function ModalFilter(show, selectedCategory) {

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);

  const [isModalVisible, setIsModalVisible] = useState(show.show);
  const [category, setCategory] = React.useState(selectedCategory.selectedCategory);

  useEffect(() => {
    if(show.show){
      setIsModalVisible(true)
    }else{
      setIsModalVisible(false)
    }
  }, [show])

  return (
    <View style={{}}>
      <Modal 
      isVisible={isModalVisible}
      onBackdropPress={() => setIsModalVisible(false)}>
        <View style={{ backgroundColor: "#FFF", padding: 10, margin: 30, height: 340}}>
          <Text style={normalize(12)}>Categoria</Text>
          <RadioButton.Group onValueChange={value => setCategory(value)}  value={category}>
            <RadioButton.Item label="DOAÇÕES" value="doacoes" color={"#F4AE38"} />
            <RadioButton.Item label="SERVIÇOS" value="servicos" color={"#F4AE38"} />
            <RadioButton.Item label="TROCA-TROCA" value="trocatroca" color={"#F4AE38"} />
          </RadioButton.Group>
          {/* <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          /> */}
          {/* <View style={{flexDirection: "row",}}> */}
          <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(false)}>
            <Text style={{color: '#FFF', textAlign: 'center'}}>CONFIRMAR</Text>
          </TouchableOpacity>
          {/* </View> */}
        </View>
      </Modal>
    </View>
  );
}
