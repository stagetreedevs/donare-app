import { StyleSheet, Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  carouselContainer: {
    minHeight: 250
  },
  carousel: {},

  image: {
    width: '100%',
    height: 360
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: viewportWidth,
    height: 360
  },
  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 320
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0
  },
  infoRecipeContainer: {
    flex: 1,
    margin: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoPhoto: {
    height: 20,
    width: 20,
    marginRight: 0
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
    color: '#F4AE38'
  },
  infoDescriptionRecipe: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 30,
    marginBottom: 50,
    margin: 15,
    textAlign: 'justify'
  },
  infoRecipeName: {
    fontSize: 28,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  dateCityState: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fab: {
    backgroundColor: '#F4AE38',
    position: 'absolute',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 0,
  },
});

export default styles;
