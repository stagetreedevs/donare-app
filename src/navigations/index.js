import React, {useEffect, useState, useContext} from 'react';
import {LanguagesContext} from '../contexts/Languages';
import {LogBox, Platform} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterUserScreen from '../screens/RegisterUser/RegisterUserScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword/ForgotPasswordScreen';
import ConfirmCodeScreen from '../screens/ConfirmCode/ConfirmCodeScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import CategoriesScreen from '../screens/Categories/CategoriesScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RecipesListScreen from '../screens/RecipesList/RecipesListScreen';
import DrawerContainer from '../screens/DrawerContainer/DrawerContainer';
import IngredientScreen from '../screens/Ingredient/IngredientScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import IngredientsDetailsScreen from '../screens/IngredientsDetails/IngredientsDetailsScreen';
import DonationRegisterScreen from '../screens/DonationRegister/DonationRegisterScreen';
import MapLocationScreen from '../screens/MapLocation/MapLocationScreen';
import MatchesScreen from '../screens/Matches/MatchesScreen';
import NotificationsUserScreen from '../screens/NotificationsUser/NotificationsUserScreen';
import SelectedProductTrocaTrocaScreen from '../screens/SelectedProductTrocaTroca/SelectedProductTrocaTrocaScreen';
import MyProductsDonationScreen from '../screens/MyProductsDonation/MyProductsDonationScreen';

export default function Routes() {
  const {selectLanguage} = useContext(LanguagesContext);

  const MainNavigator = createStackNavigator(
    {
      Login: {
        screen: LoginScreen,
        navigationOptions: {
          headerShown: false,
          gestureEnabled: false,
          drawerLockMode: 'locked-closed',
          drawerLabel: () => null,
        },
      },
      RegisterUser: {
        screen: RegisterUserScreen,
        navigationOptions: {headerShown: false},
      },
      ForgotPassword: {
        screen: ForgotPasswordScreen,
        navigationOptions: {headerShown: false},
      },
      ConfirmCode: {
        screen: ConfirmCodeScreen,
        navigationOptions: {headerShown: false},
      },
      DonationRegister: {
        screen: DonationRegisterScreen,
        navigationOptions: {
          title: `${selectLanguage?.addTitle}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      ServiceRegister: {
        screen: DonationRegisterScreen,
        navigationOptions: {
          title: `${selectLanguage?.serviceTitle}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      TrocatrocaRegister: {
        screen: DonationRegisterScreen,
        navigationOptions: {
          title: `${selectLanguage?.productTitle}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      Home: HomeScreen,
      MapLocation: {
        screen: MapLocationScreen,
        navigationOptions: {
          title: `${selectLanguage?.titleLocation}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      Matches: {
        screen: MatchesScreen,
        navigationOptions: {
          title: `${selectLanguage.titleMyMatches}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      MyProductsDonation: {
        screen: MyProductsDonationScreen,
        navigationOptions: {
          title: `${selectLanguage.titleMyProducts}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      SelectedProductTrocaTroca: {
        screen: SelectedProductTrocaTrocaScreen,
        navigationOptions: {
          title: `${selectLanguage?.selectTitle}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      Notifications: {
        screen: NotificationsUserScreen,
        navigationOptions: {
          title: `${selectLanguage.titleNotification}`,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      Profile: {
        screen: ProfileScreen,
        navigationOptions: {
          title: selectLanguage.profileTitle,
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      Categories: CategoriesScreen,
      Recipe: RecipeScreen,
      RecipesList: RecipesListScreen,
      Ingredient: IngredientScreen,
      Search: {
        screen: SearchScreen,
        navigationOptions: {
          title: 'Search',
          headerStyle: {
            backgroundColor: '#F4AE38',
          },
          headerTitleStyle:
            Platform.OS === 'android'
              ? {alignSelf: 'center', marginLeft: -54}
              : {alignSelf: 'center'},
          headerTintColor: '#fff',
        },
      },
      IngredientsDetails: IngredientsDetailsScreen,
    },
    {
      initialRouteName: 'Login',
      // headerMode: 'float',
      defaulfNavigationOptions: ({navigation}) => ({
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        },
        headerStyle: {
          backgroundColor: '#F4AE38',
          borderWidth: 0,
        },
      }),
      navigationOptions: () => ({
        headerStyle: {
          backgroundColor: '#FDCC58',
          borderWidth: 0,
        },
      }),
    },
  );

  const DrawerStack = createDrawerNavigator(
    {
      Main: MainNavigator,
    },
    {
      drawerPosition: 'left',
      initialRouteName: 'Main',
      drawerWidth: 265,
      contentComponent: DrawerContainer,
    },
  );

  const AppContainer = createAppContainer(DrawerStack);

  LogBox.ignoreAllLogs(false);

  return <AppContainer />;
}
