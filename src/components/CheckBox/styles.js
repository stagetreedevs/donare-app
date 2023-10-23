import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  CheckBox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  WrapperCheckBox: {
    flexDirection: "row",
    alignItems: "center"
  },
  LabelCheck: {
    color: '#F4AE38',
    marginLeft: 6 // Para que não fique colado ao checkbox
  }
})

export default styles;
