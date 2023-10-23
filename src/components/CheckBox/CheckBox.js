import React from 'react';
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, TouchableOpacity, Text } from 'react-native';

import styles from './styles';

export default function CheckBox(props) {
  
  function handleChange() {
    const { onChange } = props;
    if (onChange) {
      return onChange();
    }
  }

  return (
    <View style={styles.WrapperCheckBox}>

      <TouchableOpacity onPress={handleChange} style={[
        styles.CheckBox,
        { borderColor: props.checkColor ? props.checkColor : '#fff' }
      ]}>

        {
          props.value ? <Icon name="check"
            style={{
              fontSize: 16,
              color: props.iconColor ? props.iconColor : '#fff'
            }}
          /> : null
        }

      </TouchableOpacity>

      <Text style={[styles.LabelCheck, props.labelStyle]}>
        {props.label}
      </Text>
    </View>
  );
}

CheckBox.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  iconColor: PropTypes.string,
  onChange: PropTypes.func,
  value : PropTypes.bool,
  checkColor : PropTypes.string 
}
