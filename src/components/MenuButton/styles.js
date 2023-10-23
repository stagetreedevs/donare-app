import { StyleSheet } from 'react-native';
//import { normalize } from '../../util';

const styles = StyleSheet.create({
  btnClickContain: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btnIcon: {
    height: 30,
    width: 30
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 6
  }
});

export default styles;
