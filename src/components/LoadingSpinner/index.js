import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

export const LoadingSpinner = ({
  visible,
  text,
  color,
  ...props
}) => {
  return (
    <Spinner
      visible={visible}
      animation={"fade"}
      textContent={text}
      textStyle={{color: color}}
    />
  )
};
