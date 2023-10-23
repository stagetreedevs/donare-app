import {StyleSheet, Dimensions} from 'react-native';
import {normalize} from 'react-native-elements';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F4AE38',
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  editProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    color: '#FFF',
  },
  profilePhoto: {
    width: 180,
    height: 180,
    borderRadius: 800,
    marginTop: height * 0.08,
    alignSelf: 'center',
    marginLeft: 6,
  },
  profileName: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
    marginLeft: 6,
  },
  spinnerTextStyle: {
    color: '#FFF',
    fontSize: 14,
  },
});

export default styles;
