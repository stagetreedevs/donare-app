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
  },
  containerLogo: {
    flex: 1,
    justifyContent: "center",
    alignContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginTop: 60,
    marginBottom: 30,
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
  buttonForgotPassword: {
    backgroundColor: "#F4AE38",
    width: "90%",
    height: 45,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 8,
    marginTop:20,
  },
  textForgotPassword: {
    color: "#f1f1f1",
    fontSize: 18
  },
  viewReturnLogin: {
    flexDirection: 'row', 
    alignItems: 'center', 
    alignContent: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 100,
  },
  buttonReturnLogin: {
    marginTop: 10,
  },
  textReturnLogin: {
    fontSize: 15,
    color: "#F4AE38",
    fontWeight: 'bold',
    marginTop: 20
  },
});
 
export default styles;
