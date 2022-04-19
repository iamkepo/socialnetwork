/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image,  TextInput, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Entypo, Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { setuser, getusers, getuser } from "../utils/sender";
import UserComponent from '../components/UserComponent';

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const wait = timeout => {
  return new Promise(resolve => { setTimeout(resolve, timeout); });
};
const screen = Dimensions.get("screen");

class SearchScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      list: [],
      users: [],
      refreshing: false,
      query: "",
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
  onRefresh() {
    getusers().then((response)=>{
      this.setState({list: response.data});
    }).catch((error)=>{
      console.log(error);
    })
    wait(2000).then(() => this.setState({refreshing: false}));
  }
  async updateSearch(text) {
    this.setState({users: []});
    this.setState({query: text});
    if (text != "" ){
      let stock = [];
      this.state.list.forEach(item => {
        if (item.psoeudo.search(text) != -1) {
          stock = stock.concat(item);
        }
      });
      this.setState({users: stock});
    }
  }
  suivre(him){
    var data = {
      me: this.props.data.user._id,
      him: him,
      option: (this.props.data.user.following.find(item => item == him)) == undefined ? "followingpush" : "followingremove"
    }
    setuser(data).then(()=>{
      getuser(this.props.data.user._id).then((response)=>{
        this.props.userAction(response.data);
      })
    })
  }

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

          <TextInput
            style={styles.textInput}
            placeholder="Rechercher"
            placeholderTextColor="#FFF"
            value={this.state.query}
            onChangeText={(text) => this.updateSearch(text)}
          />

        </View>
        
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=> this.onRefresh()} />}>

          <View style={styles.sous}>
            {
              this.state.users.map((user, i)=>(
                <UserComponent
                  key={i}
                  user={user}
                  goto={()=>  this.navigation.navigate("ProfileScreen", { user: user }) }
                  suivre={()=> this.suivre(user._id)}
                  add={(this.props.data.user.following.find(item => item == user._id)) == undefined && user._id != this.props.data.user._id}
                  remote={(this.props.data.user.following.find(item => item == user._id)) != undefined}
                  addback={(this.props.data.user.follower.find(item => item == user._id)) != undefined}
                  me={user._id == this.props.data.user._id}
                />
              ))
            }
          </View>

        </ScrollView>

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  title: {
    width: "80%",
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "#FFF"
  },
  textInput: {
    width: '85%',
    height: "100%",
    color: "#FFF",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    paddingLeft: "5%"
  },
  sous: {
    width: screen.width,
    height: screen.height,
    alignItems: 'center',
    justifyContent: "flex-start",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
