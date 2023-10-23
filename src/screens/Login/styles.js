import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  background:{
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: "center",
    backgroundColor: "#EDEDED",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    paddingTop: 50,
    paddingBottom: 50
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
    alignContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: 240,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    margin: 30,
  },
  input: {
    backgroundColor: "#f1f1f1",
    width: "90%",
    marginBottom: 15,
    color: "#222",
    fontSize: 17,
    borderRadius: 8,
    padding: 10,
  },
  buttonSubmit: {
    backgroundColor: "#F4AE38",
    width: "90%",
    height: 45,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 8,
    marginTop:40,
  },
  flagsCountry:{
    marginLeft: 20,
  },
  textSubmit: {
    color: "#f1f1f1",
    fontSize: 18
  },
  viewRegister: {
    marginLeft: -20,
    flexDirection: 'row', 
    alignItems: 'center', 
    alignContent: 'center', 
    justifyContent: 'center', 
  },
  buttonRegister: {
    marginTop: 10,
  },
  textRegister: {
    fontSize: 15,
    color: "#F4AE38",
    fontWeight: 'bold'
  },
  forgot_button: {
    height: 30,
    marginTop: 20,
    color: "#F4AE38",
  },
});
 
export default styles;
