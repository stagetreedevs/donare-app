import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  addImg: {
      backgroundColor: '#F4AE38',
      padding: 10,
      margin: 10,
      width: '60%',
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
  },
  deleteImg: {
    backgroundColor: '#e74c3c',
    padding: 10,
    margin: 10,
    width: '42%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
},
  addImgDesactive: {
    backgroundColor: '#ccc',
    padding: 10,
    margin: 10,
    width: '60%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
},
  addImgText: {
      color: '#fff',
      fontSize: 16,
  },
  background:{
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    // paddingTop: "5%",
    // marginTop: "10%",
    // width: "100%",
    // height: "100%",
  },
  container: {
    backgroundColor: '#f1f1f1',
    // alignItems: "center",
    // justifyContent: "center",
    // width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10
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
    width: 40,
    height: 40,
    resizeMode: 'contain',
    margin: 30,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    color: "#222",
    fontSize: 17,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    textAlignVertical: "top",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 8,
    color: "#222",
    fontSize: 17,
    borderRadius: 8,
    padding: 10,
  },
  buttonSubmit: {
    backgroundColor: "#F4AE38",
    width: "100%",
    height: 45,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 8,
    marginTop:30,
  },
  textSubmit: {
    color: "#f1f1f1",
    fontSize: 18
  },
  viewRegister: {
    flexDirection: 'row', 
    alignItems: 'center', 
    alignContent: 'center', 
    justifyContent: 'center', 
    // marginBottom: 150
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

    // marginBottom: 30,
  },
  // inputArea: {
  //   flexDirection: 'row',
  //   // backgroundColor: "#f1f1f1",
  //   // width: "90%",
  //   // marginBottom: 15,
  //   // color: "#222",
  //   // fontSize: 17,
  //   // borderRadius: 8,
  //   // padding: 10,
  //   // alignItems: 'center',
  //   // alignContent: 'center',
  //   // justifyContent: 'center'
  // },
  // icon: {
  //   width: '15%',
  //   height: 50,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // }
  headline_text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 20,
  },
  explore_text: {
    marginTop: 5,
    marginBottom: 10,
    color: '#000',
    marginLeft: 20,
    fontSize: 12,
    fontWeight: '600',
  },
});
 
export default styles;
