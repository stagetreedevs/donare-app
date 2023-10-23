import React from 'react';
import { TouchableHighlight, TouchableOpacity, Image, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';


const functionV = () => {
  console.log('ViewIngredientsButton');
}
export default class ViewIngredientsButton extends React.Component {
  
  render() {
    return (
      <TouchableOpacity onPress={() => functionV()}>
        <View style={styles.container}>
          <Text style={styles.text}>Fazer doação</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

ViewIngredientsButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string
};
