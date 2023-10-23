import { StyleSheet, Dimensions } from 'react-native';

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
});
 
export default styles;
