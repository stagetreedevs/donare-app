import { StyleSheet } from 'react-native';
import { normalize } from 'react-native-elements';

const styles = StyleSheet.create({
  background:{
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
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
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
    marginTop: 20,
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20
  },
  text: {
    fontSize: normalize(12),
    textAlign: 'center',
    color: '#F4AE38',
    paddingBottom: 10
  }
});
 
export default styles;
