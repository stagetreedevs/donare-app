import React from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import styles from './styles';
import { getRecipes, getCategoryName, getRecipesByRecipeName, getRecipesByCategoryName, getRecipesByIngredientName } from '../../data/MockDataAPI';

export default class RecipesListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const { params = {} } = navigation.state;
    return {
      title: navigation.getParam('title'),
      headerStyle: {
        backgroundColor: '#F4AE38',
      },
      headerTintColor: '#fff',
      headerTitle: (
        <SearchBar
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            flex: 1,
          }}
          inputContainerStyle={{
            backgroundColor: '#EDEDED',
          }}
          inputStyle={{
            backgroundColor: '#EDEDED',
            borderRadius: 6,
            color: 'black',
            width: width * 0.5,
          }}
          searchIcond
          clearIcon
          //lightTheme
          round
          onChangeText={text => params.handleSearch(text)}
          //onClear={() => params.handleSearch('')}
          placeholder="Busca"
          value={params.data}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      handleSearch: this.handleSearch,
      data: this.getValue
    });
  }

  handleSearch = text => {
    var recipeArray1 = getRecipesByRecipeName(text);
    var recipeArray2 = getRecipesByCategoryName(text);
    var recipeArray3 = getRecipesByIngredientName(text);
    var aux = recipeArray1.concat(recipeArray2);
    var recipeArray = [...new Set(aux)];
    if (text == '') {
      this.setState({
        value: text,
        data: recipeArray
      });
    } else {
      this.setState({
        value: text,
        data: recipeArray
      });
    }
  };

  getValue = () => {
    return this.state.value;
  };

  onPressRecipe = item => {
    this.props.navigation.navigate('Recipe', { item });
  };

  renderRecipes = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressRecipe(item)}>
      <View style={styles.container}>
        <Image style={styles.photo} source={{ uri: item.photo_url }} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.category}>{getCategoryName(item.categoryId)}</Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('category');
    const recipesArray = getRecipes(item.id);
    return (
      <View>
        <Text style={{marginHorizontal: 20, marginTop: 20, fontSize: 20, fontWeight: 'bold', color: '#444444',}}>DOAÇÕES</Text>
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={recipesArray}
          renderItem={this.renderRecipes}
          keyExtractor={item => `${item.recipeId}`}
        />
      </View>
    );
  }
}
