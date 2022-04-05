/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, StyleSheet, BackHandler} from 'react-native';
import { Entypo } from 'react-native-vector-icons';

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

class StarterScreen extends React.Component {

	constructor(props) {
		super(props);

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

	}

	render() {
		return (
			<View style={styles.container}>

        <View  style={{ width: "100%", height: "40%", alignItems: "center",  justifyContent: "space-evenly" }}>

          <Entypo name="emoji-sad" size={30} color="#FFF" style={{ marginLeft: 0, marginRight: -5, }}/>

          <Text style={{width: "60%",textAlign: "center",fontSize: normalize(18), fontWeight: "bold", color: "#FFF" }}>
            Vous n'avez pas de compte connecter sur ce téléphone
          </Text>

          <Text style={{ width: "85%", textAlign: "center", fontSize: normalize(15), color: "#FFF" }}>
            {"Cliquer pour générer un nouveau compte"}
            {"\n (cette version Beta ne dispose pas encore de l'option récupération de compte)"}
          </Text>

					<TouchableOpacity
            onPress={()=> this.register() }
            style={styles.btn}
          >

            <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}> Générer </Text>

          </TouchableOpacity>

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
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center"
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
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(StarterScreen);
