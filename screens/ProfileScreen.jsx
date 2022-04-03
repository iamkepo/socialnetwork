/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AntDesign, Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { upload } from "../utils/sender";

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

class ProfileScreen extends React.Component {

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

    this.onRefresh();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh(){
    this.setState({refreshing: true});

    wait(2000).then(() => this.setState({refreshing: false}));
  };
  async pickImage(type, y=4) {
    let p = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type,
      allowsEditing: true,
      aspect: [4, y],
      quality: 1,
    });

    //console.log(p);
    if (p.cancelled == false) {
      this.setState({file: p})
    }
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
            {this.route.params.user._id == this.props.data.user._id ? "Profile" : this.route.params.user._id}
          </Text>

        </View>

        <View style={styles.sous}>

          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>this.onRefresh()}
              />
            }
          >
            <View style={styles.profilbox}>
              <TouchableOpacity style={styles.profil} onPress={()=> false}>
                {
                  this.props.data.user.photo == "" ?
                  <AntDesign name="user" size={normalize(50)} color="#FFF"/>
                  :
                  <Image source={{uri: this.props.data.user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
                }
              </TouchableOpacity>
              <Text style={styles.psoeudo}>
                {this.route.params.user.psoeudo != "" ? this.route.params.user.psoeudo : this.route.params.user._id}
              </Text>
              <View style={styles.boxfollow}>
                <TouchableOpacity style={styles.btnfollow} onPress={()=> false}>
                  <Text style={styles.textfollow}> Following </Text>
                  <Text style={styles.numberfollow}> 1880 </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnfollow} onPress={()=> false}>
                  <Text style={styles.textfollow}> Follower </Text>
                  <Text style={styles.numberfollow}> 10K </Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>

        </View>

			</View>
		);

	}

}

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
    width: "80%",
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#FFF"
  },
  sous: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: "flex-start",
  },
  profilbox: {
    width: screen.width,
    height: screen.height/4,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  profil: {
    width: "30%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F00",
    borderRadius: 70,
  },
  psoeudo: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
  boxfollow: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  btnfollow: {
    width: "45%",
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
  textfollow: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
  numberfollow: {
    fontSize: normalize(15),
    color: "#FFF"
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
