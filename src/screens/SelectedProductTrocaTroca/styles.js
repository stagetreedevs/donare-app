import { StyleSheet, Dimensions } from 'react-native';
import { normalize } from '../../util';

const styles = StyleSheet.create({
  backgroundContainer:{
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: "center",
    backgroundColor: "#EDEDED",
    padding: 20,
  },
  accept: {
    color: "#00BFA5",
  },
  refuse: {
    color: "#D32F2F",
  },
  waiting: {
    color: "#3498db",
  },
  container: {
    flex: 1,
    width: '90%',
    marginBottom: 20,
  },
  image: {
    width: 140,
    height: 140,
    alignSelf: "center",
  },
  products: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20
  },
  titleDoacoes: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#444444',
    paddingBottom: 10
  },
  text: {
    fontSize: normalize(12),
    textAlign: 'center',
    color: '#F4AE38',
    paddingBottom: 10
  }
});
 
export default styles;
