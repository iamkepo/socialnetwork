/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AntDesign, Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';

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

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
class DiscussionScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      refreshing: false,
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

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh(){
    this.setState({refreshing: true});

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
            Discussion
          </Text>

          <TouchableOpacity onPress={()=> false}>
            <AntDesign name="search1" size={30} color="#FFF"/>
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
          <View style={{height: 30}} />

          {
            users.map((user, i)=>(
              <TouchableOpacity key={i}
                style={styles.discussion}
                onPress={()=> this.navigation.navigate("MessageScreen", { user_id: i })}
              >
                <AntDesign name="user" size={30} color="#FFF"/>

                <View style={styles.textbox}>
                  <Text style={styles.name}> {user.name} {i} </Text>
                  <Text style={styles.lastmessage}> {user.lastmessage} </Text>
                </View>
              </TouchableOpacity>
            ))
          }

        </ScrollView>

			</View>
		);

	}

}

const users = [
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" },
  { name: "user", lastmessage: "comment vas-tu ?" }
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
  },
  discussion: {
    width: screen.width-30,
    height: screen.height/10,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 10,
    marginTop: "5%",
    paddingLeft: "5%"
  },
  textbox: {
    width: "85%",
    height: "100%",
    alignItems: 'center',
    justifyContent: "space-evenly",
  },
  name: {
    width: "100%",
    height: "30%",
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#FFF"
  },
  lastmessage: {
    width: "100%",
    height: "50%",
    fontSize: normalize(15),
    color: "#FFF"
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(DiscussionScreen);
