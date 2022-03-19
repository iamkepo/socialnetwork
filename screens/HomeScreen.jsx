import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const screen = Dimensions.get("screen");

class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  backAction = () => {
    BackHandler.exitApp()
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }


  componentDidMount(){

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  detail(i, item){
    this.props.parseAction({i: i, item: item});
    this.navigation.navigate('Restaurant');
  }
  render(){
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.text} >HomeScreen</Text>
          <StatusBar style="auto" />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: screen.height,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 100
  },
  text: {
    fontSize: normalize(15)
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
