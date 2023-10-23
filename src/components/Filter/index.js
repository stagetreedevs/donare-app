import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

export default class Filter extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.headerButtonContainer} onPress={this.props.onPress}>
        <Image
          style={styles.headerButtonImage}
          source={require('../../../assets/icons/filter.png')}
        />
      </TouchableOpacity>
    );
  }
}

Filter.propTypes = {
  onPress: PropTypes.func
};
