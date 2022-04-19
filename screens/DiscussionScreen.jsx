/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AntDesign, Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import DiscussionComponent from '../components/DiscussionComponent';

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

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
class DiscussionScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      refreshing: false,
      discussions: []
    }
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  backAction = () => {
    this.back();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }

  componentDidMount(){
    this.onRefresh();
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh(){
    this.setState({refreshing: true});
    this.setState({discussions: list_discussions_test})
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  back() {
    this.navigation.goBack()
  }
	render() {
		return (
			<View style={styles.container}>

        <View style={styles.head}>

          <TouchableOpacity onPress={()=> this.back()}>
            <Ionicons name="arrow-back" size={30} color="#FFF"/>
          </TouchableOpacity>

          <Text style={styles.title}>
            Discussions
          </Text>

          <TouchableOpacity onPress={()=> false}>
            <AntDesign name="search1" size={30} color="#000"/>
          </TouchableOpacity>

        </View>

        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={()=>this.onRefresh()}
            />
          }
        >
          <View style={{height: 10}} />
          {
            this.state.discussions.map((discussion, i)=>(
              <DiscussionComponent 
                key={i} 
                discussion={discussion} 
                goto={()=> this.navigation.navigate("MessageScreen", { discussion: discussion })} 
              />
            ))
          }

          <View style={{height: 50}} /> 
        </ScrollView>

			</View>
		);

	}

}

const list_discussions_test = [
  { 
    _id: "discussion_id",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: false,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
  { 
    _id: "discussion",
    users: [
      { user_id: "user1", psoeudo: "user1", photo: "" },
      { user_id: "user2", psoeudo: "user2", photo: "" }
    ], 
    last:{
      user_id: "user2",
      message: "comment vas-tu ?",
      vue: true,
      date: Date()
    },
    type: "duo"
  },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  head: {
    width: "95%",
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    width: "70%",
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#FFF"
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(DiscussionScreen);
