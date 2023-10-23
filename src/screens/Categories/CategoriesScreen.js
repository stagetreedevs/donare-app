import React from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import styles from './styles';
import { categories } from '../../data/dataArrays';
import { getNumberOfRecipes } from '../../data/MockDataAPI';

export default class CategoriesScreen extends React.Component {
  static navigationOptions = {
    title: 'Categorias',
    headerStyle: {
      backgroundColor: '#F4AE38',
    },
    headerTintColor: '#fff',
  };

  constructor(props) {
    super(props);
  }

  onPressCategory = item => {
    const title = item.name;
    const category = item;
    this.props.navigation.navigate('RecipesList', { category, title });
  };

  renderCategory = ({ item }) => {
    return(
      <TouchableOpacity onPress={() => this.onPressCategory(item)}>
        <View style={styles.categoriesItemContainer}>
          <Image style={styles.categoriesPhoto} source={{ uri: item.photo_url }} />
          <Text style={styles.categoriesName}>{item.name}</Text>
          <Text style={styles.categoriesInfo}>{getNumberOfRecipes(item.id)} itens</Text>
        </View>
      </TouchableOpacity>
    )
  };

  render() {
    return (
      <View>
        <FlatList
          data={categories}
          renderItem={this.renderCategory}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    );
  }
}
