import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, BackHandler, TouchableOpacity } from 'react-native';
import { Entypo } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { checkversion } from "../utils/sender";

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


  async componentDidMount(){

    checkversion("0.0.1").then((response)=>{
      //console.log(response.data.response);
      if (response.data.response == false) {
        this.navigation.navigate("UpdateScreen");
      }
    }).catch((error)=>{
      console.log(error);
    })

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.posts}>

          <Text style={styles.text} >HomeScreen</Text>


        </View>
          <TouchableOpacity onPress={()=> this.navigation.navigate("UploadScreen") } style={styles.newpost}>
            <Entypo name="plus" size={30} color="#FFF"/>
          </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: screen.height,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  posts: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: "center",
  },
  text: {
    fontSize: normalize(15)
  },
  newpost: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F00",
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
    right: screen.width/2.5,
    zIndex: 5,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
