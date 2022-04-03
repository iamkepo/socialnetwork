import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import HomeScreen from '../screens/HomeScreen';
import UpdateScreen from '../screens/UpdateScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DiscussionScreen from '../screens/DiscussionScreen';
import MessageScreen from '../screens/MessageScreen';
import CommentScreen from '../screens/CommentScreen';
import SinglePostScreen from '../screens/SinglePostScreen';
import CashScreen from '../screens/CashScreen';


const Stack = createStackNavigator();

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

class HomeNavigator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  render(){
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="UpdateScreen"
          component={UpdateScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="UploadScreen"
          component={UploadScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="DiscussionScreen"
          component={DiscussionScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="MessageScreen"
          component={MessageScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="CommentScreen"
          component={CommentScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="SinglePostScreen"
          component={SinglePostScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
        <Stack.Screen
          name="CashScreen"
          component={CashScreen}
          route={this.route}
          navigation={this.navigation}
          options={{ headerLeft: false, headerTitle: false, headerStyle: { height: 0 },}}
        />
      </Stack.Navigator>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeNavigator);
