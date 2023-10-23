import React, { useEffect, useState } from "react";
import { Button, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { normalize } from "../../util/Normalize"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ModalTermsUse(show) {

  const { width, height } = Dimensions.get('window');
  console.log(show, "aqui")
  const [isModalVisible, setModalVisible] = useState(show.show);


  const closeModal = () => {
    setModalVisible(!isModalVisible);
    showModal(aux);
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={isModalVisible} animationType='fade'
        transparent={true}>
        <View
          style={{ flex: 1, backgroundColor: '#FFF', alignItems: 'center', borderRadius: 8 }}
        >
          <ScrollView>

            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <TouchableOpacity onPress={() => this.displayModalTermsUse(!this.state.modalTermsUseVisible)}>
                <MaterialCommunityIcons
                  name='arrow-left'
                  style={{ fontSize: 30, marginLeft: 12, marginTop: 10, marginRight: 45, color: '#F4AE38' }}
                />
              </TouchableOpacity>

              <Text
                style={{ textAlign: 'center', alignSelf: 'center', marginTop: 8, marginLeft: 30, fontSize: normalize(22), fontWeight: 'bold', color: '#444444', }}>
                Termos de uso
              </Text>

            </View>

            <Text
              style={{ textAlign: 'justify', marginTop: 20, paddingHorizontal: 16, marginBottom: 30, fontSize: normalize(16), color: '#444444', }}>
              Lorem ipsum dolor sit amet. Ea incidunt accusamus qui molestiae distinctio non magni commodi 33
              excepturi sint. Aut doloremque porro et corrupti fugiat a accusantium pariatur ut esse similique.
              Et pariatur sunt et error dolor ex praesentium nihil qui cupiditate tempora.
              Eos totam molestiae sit possimus dolore est incidunt impedit rem dolor similique qui dolor
              possimus et perspiciatis placeat. Eum Quis sapiente delectus quam sed quae error sit autem
              accusantium et repellendus minima. Ut reiciendis labore quo dolor numquam 33 voluptatem sequi
              eos dolorem placeat sit autem dolores eum autem voluptatibus.
              33 optio blanditiis ut omnis eius sit vitae voluptas ea quia ipsum. Ut animi odio est fugiat
              molestias sit assumenda dolorum qui praesentium nihil et expedita animi est explicabo minus. Ut
              dolorem voluptates sed deleniti unde in voluptatum itaque ab nihil nihil ea itaque tempore! Quo
              excepturi facilis a sint iste qui impedit dolores id dignissimos perspiciatis sed mollitia earum
              non facilis voluptas.
              Lorem ipsum dolor sit amet. Ea incidunt accusamus qui molestiae distinctio non magni commodi 33
              excepturi sint. Aut doloremque porro et corrupti fugiat a accusantium pariatur ut esse similique.
              Et pariatur sunt et error dolor ex praesentium nihil qui cupiditate tempora.
              Eos totam molestiae sit possimus dolore est incidunt impedit rem dolor similique qui dolor
              possimus et perspiciatis placeat. Eum Quis sapiente delectus quam sed quae error sit autem
              accusantium et repellendus minima. Ut reiciendis labore quo dolor numquam 33 voluptatem sequi
              eos dolorem placeat sit autem dolores eum autem voluptatibus.
              33 optio blanditiis ut omnis eius sit vitae voluptas ea quia ipsum. Ut animi odio est fugiat
              molestias sit assumenda dolorum qui praesentium nihil et expedita animi est explicabo minus. Ut
              dolorem voluptates sed deleniti unde in voluptatum itaque ab nihil nihil ea itaque tempore! Quo
              excepturi facilis a sint iste qui impedit dolores id dignissimos perspiciatis sed mollitia earum
              non facilis voluptas.
            </Text>

            <View style={{ alignItems: 'center', alignContent: 'center', marginTop: 50 }}>

              <TouchableOpacity
                onPress={() => this.displayModalTermsUse(!this.state.modalTermsUseVisible)}
                style={{ backgroundColor: '#F4AE38', padding: 10, width: 200, borderRadius: 160, bottom: 0, marginBottom: 20, position: 'absolute' }}
              >
                <Text style={{ fontSize: normalize(20), color: '#FFF', fontWeight: '600', textAlign: 'center', }}>Fechar</Text>
              </TouchableOpacity>

            </View>

          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

export default ModalTermsUse;
