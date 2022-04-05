/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, BackHandler} from 'react-native';
import { Entypo, AntDesign } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { setuser, getuser } from "../utils/sender";

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

class StarterScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state = {
      step: 0
    };
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

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
	register() {
    var data = {
      option: "register"
    }
    setuser(data).then((response1)=>{
      //console.log(response1.data.insertedId);
      if (response1.data.insertedId) {
        getuser(response1.data.insertedId).then((response2)=>{
          //console.log(response2.data);
          this.props.userAction("init", response2.data);
        }).catch((error)=>{
          console.log(error);
        })
      }
    }).catch((error)=>{
      console.log("register: "+error);
    })
	}

	render() {
		return (
			<View style={styles.container}>
        {
          this.props.data.user._id == undefined ?
          <View  style={styles.sous}>

            <Entypo name="emoji-sad" size={30} color="#FFF" />

            <Text style={styles.title}>
              Vous n'avez pas de compte connecter sur ce téléphone
            </Text>

            <Text style={styles.text}>
              {"Cliquer pour générer un nouveau compte"}
              {"\n \n (cette version Beta ne dispose pas encore de l'option récupération de compte)"}
            </Text>

            <TouchableOpacity onPress={()=> this.register() } style={styles.btn}>
              <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}> Générer </Text>
            </TouchableOpacity>

          </View>
          :
          <View  style={styles.sous}>

            <View style={styles.profilicon}>
              <AntDesign name="user" size={normalize(50)} color="#FFF"/>
            </View>

            <Text style={styles.title}>
              Vous ètes enrégistré maintenant
            </Text>

            <Text style={styles.profiltext}>
              {"psoeudo: "+this.props.data.user.psoeudo}
              {"\n\nbio: "+ this.props.data.user.bio}
              {"\n\nsolde: "+ this.props.data.user.solde}
            </Text>

            <TouchableOpacity onPress={()=> this.navigation.reset({ index: 0, routes: [{ name: 'MainNavigator' }]}) } style={styles.btn}>
              <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}> Commencer </Text>
            </TouchableOpacity>

          </View>
        }

			</View>
		);

	}

}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  sous: {
    width: "100%",
    height: "50%",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  title:{
    width: "70%",
    textAlign: "center",
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
  text: {
    width: "85%",
    textAlign: "center",
    fontSize: normalize(15),
    color: "#FFF"
  },
  btn: {
    backgroundColor: "#BB0000",
    width: "50%",
    height: 50,
    justifyContent: "center",
    borderRadius: 50,
    borderWidth: 0,
    borderColor: "#000000",
    flexDirection: "column",
    shadowColor: '#BB0000',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
    elevation: 0,
  },
  profilicon: {
    width: "35%",
    height: "29%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F00",
    borderRadius: 70,
  },
  profiltext: {
    textAlign: "left",
    fontSize: normalize(15),
    color: "#FFF"
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(StarterScreen);
