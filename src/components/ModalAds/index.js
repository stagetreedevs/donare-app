/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Button, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { normalize } from '../../util/Normalize';
import { BASE_URL } from '../../services/api';
import api from '../../services/api';

function ModalAds({ time }) {

  const { width, height } = Dimensions.get('window');
  const [isModalVisible, setModalVisible] = useState(false);
  const [arrayImageAds, setArrayImageAds] = useState([
  ]);
  const [currentImageAds, setCurrentImageAds] = useState(1);


  useEffect(() => {
    handleAddImageAds();
  }, []);

  handleAddImageAds = async () => {
    api.get('ads')
      .then((response) => {
        // console.log(response.data.length, "response ADS")
        for (let index = 0; index < response.data.length; index++) {
          if (arrayImageAds.indexOf(response.data[index].image.formats.large.url) === -1) {
            arrayImageAds.push(BASE_URL + response.data[index].image.formats.large.url);
          }
        }
      })
      .catch((err) => {
        console.error('ops! ocorreu um erro ' + err);
      });
  };

  function showModal(modalAdsNumberParam) {
    setCurrentImageAds(modalAdsNumberParam);
    console.log(currentImageAds);
  }
  setTimeout(() => {
    if (isModalVisible !== true) {
      setModalVisible(!isModalVisible);
    }
  }, 1000 * time);

  const closeModal = () => {
    setModalVisible(!isModalVisible);
    let aux = Math.floor(Math.random() * arrayImageAds.length) + 0;
    showModal(aux);
    // console.log(arrayImageAds, "aux")
    // handleForceUpdate()
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={isModalVisible}>
        <View style={{ flex: 1, backgroundColor: '#FFF', alignItems: 'center', borderRadius: 8 }}>
          <Image style={{ width: width * 0.8, height: height * 0.3, marginTop: height * 0.25, alignItems: 'center', alignContent: 'center', alignSelf: 'center' }} source={{ uri: arrayImageAds[currentImageAds] }} />
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: normalize(22), fontWeight: 'bold', color: '#444444' }}>Apoia o Donare</Text>
          <TouchableOpacity onPress={() => closeModal()} style={{ backgroundColor: '#F4AE38', padding: 10, width: 200, borderRadius: 160, bottom: 0, marginBottom: 20, position: 'absolute' }}>
            <Text style={{ fontSize: normalize(20), color: '#FFF', fontWeight: '600', textAlign: 'center' }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

export default ModalAds;
