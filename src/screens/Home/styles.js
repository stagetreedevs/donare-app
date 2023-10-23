import { StyleSheet } from 'react-native';
import { RecipeCard } from '../../AppStyles';
import { normalize } from '../../util';

const styles = StyleSheet.create({
  container: RecipeCard.container,
  photo: RecipeCard.photo,
  title: RecipeCard.title,
  category: RecipeCard.category,
  city: {
    color: "#1f1f1f",
    marginTop: 3,
    marginBottom: 3
  },
  button: {
    backgroundColor: '#F4AE38',
    padding: 12,
    borderRadius: 6,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    width: '96%', 
  },
  titleDoacoes: {
    marginHorizontal: 20,
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444444',
    paddingBottom: 10
  },
  subTitleDoacoes: {
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#F4AE38',
    paddingBottom: 10
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
  headerButtonImage: {
    height: 22,
    width: 22,
    marginHorizontal: 16
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#F4AE38',
    paddingVertical: 10
  },
  headerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButtonImage: {
    height: 22,
    width: 22,
    marginHorizontal: 16
  },
});

export default styles;
