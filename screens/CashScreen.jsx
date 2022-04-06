/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { getusers, getuser, setuser } from "../utils/sender";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    userAction
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
class CashScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      users: [],
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

    getusers().then((response)=>{
      this.setState({users: response.data});
    }).catch((error)=>{
      console.log(error);
    })
    wait(2000).then(() => this.setState({refreshing: false}));
  };
  back() {
    this.navigation.goBack();
  }
  suivre(him){
    var data = {
      me: this.props.data.user._id,
      him: him,
      option: (this.props.data.user.following.find(item => item == user._id)) == undefined ? "followingpush" : "followingremove"
    }
    setuser(data).then(()=>{
      getuser(this.props.data.user._id).then((response)=>{
        this.props.userAction(response.data);
      })
    })
  }
	render() {
		return (
			<View style={styles.container}>

        <View style={styles.head}>

          <TouchableOpacity onPress={()=> this.back()}>
            <Ionicons name="arrow-back" size={30} color="#FFF"/>
          </TouchableOpacity>

          <Text style={styles.title}>
            {this.props.data.user.solde}
          </Text>

        </View>

        <View style={[styles.sous, {height: "80%"}]}>
        <Text style={styles.title}>
            Classement
          </Text>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>this.onRefresh()}
              />
            }
          >

            {
              this.state.users.map((user, i)=>(
                <View key={i} style={styles.discussion}>
                  <TouchableOpacity
                    onPress={()=> this.navigation.navigate("ProfileScreen", { user: user._id == this.props.data.user._id ? this.props.data.user : user })}
                    style={styles.profil}
                   >
                    {
                      user.photo == "" ?
                      <AntDesign name="user" size={normalize(20)} color="#FFF"/>
                      :
                      <Image source={{uri: user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
                    }
                  </TouchableOpacity>
                  <View style={styles.textbox}>
                    <Text style={styles.name}>
                      {user.psoeudo}
                    </Text>
                    <Text style={styles.comment}> {user.solde} </Text>
                  </View>

                  {
                    (this.props.data.user.following.find(item => item == user._id)) == undefined ?
                    <TouchableOpacity style={styles.btnfollow} onPress={()=> this.suivre(user._id)}>
                      <Text style={styles.btntext}> suivre {(this.props.data.user.follower.find(item => item == user._id)) != undefined ? "en retour" : "" }</Text>
                    </TouchableOpacity>
                    :
                    (this.props.data.user.following.find(item => item == user._id)) == undefined && user._id != this.props.data.user._id ?
                    <TouchableOpacity style={styles.btnretier} onPress={()=> this.suivre(user._id)}>
                      <Text style={styles.btntext}> retirer </Text>
                    </TouchableOpacity>
                    :
                    <Text > moi meme </Text>
                  }
                </View>
              ))
            }
            <View style={{height: 30}} />
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
    alignItems: "center",
    justifyContent: "center"
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: "flex-start",
  },
  discussion: {
    width: "95%",
    height: 60,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderBottomWidth: 0.5,
    borderColor: "#FFF",
    marginTop: "5%",
  },
  profil: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#F00",
    borderRadius: 50,
  },
  textbox: {
    width: "50%",
  },
  name: {
    width: "100%",
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
  comment: {
    width: "100%",
    fontSize: normalize(15),
    color: "#FFF"
  },
  btnfollow: {
    backgroundColor: "#BB0000",
    width: "25%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  btnretier: {
    width: "25%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "#F00",
  },
  btntext: {
    fontSize: normalize(15),
    color: "#FFF",
    fontWeight: "bold",
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CashScreen);
