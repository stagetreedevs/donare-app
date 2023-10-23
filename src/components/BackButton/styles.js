import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius: 180,
    padding: 8,
    margin: 10,
    shadowColor: '#F4AE38',
    opacity: 1,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 3
    height: 36,
    width: 36,
  },
  btnIcon: {
    height: 17,
    width: 17
  }
});

export default styles;
