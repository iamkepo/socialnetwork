/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image } from 'react-native';
import { Entypo } from 'react-native-vector-icons';
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

class UploadScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {photo: {uri: ""}}
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  backAction = () => {
    this.navigation.goBack();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }


  async componentDidMount(){
    upload({photo: this.state.photo}).then((response)=>{
      console.log(response);
    }).catch((error)=>{
      console.log(error);
    })

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  async pickImage() {
    let p = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 6],
      quality: 1,
    });

    //console.log(p);

    this.setState({photo: p})
  };

	render() {
		return (
			<View style={{ width: "100%", height: "100%", backgroundColor: "#FFF", paddingHorizontal: 20, alignItems: "center",  justifyContent: "center" }}>

        <View  style={{ width: "100%", height: "90%", alignItems: "center",  justifyContent: "space-evenly" }}>

          <Text style={{width: "90%",textAlign: "center",fontSize: normalize(18), fontWeight: "bold" }}>
            Cliquer sur le plus pour ajouter une photo
          </Text>
          {
          this.state.photo.uri == "" ?
            <TouchableOpacity
              onPress={()=> this.pickImage() }
              style={{
                backgroundColor: "#FFF",
                width: "90%",
                height: "40%",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#000000",
              }}
            >
              <Entypo name="plus" size={30} color="#F00"/>
            </TouchableOpacity>
            :
            <Image source={{ uri: this.state.photo.uri }} style={{ width: "90%", height: "70%" }} />
          }


          {this.state.photo.uri != "" ? <Text style={{ width: "85%", textAlign: "center", fontSize: normalize(15), }}>
            Cliquer sur le publier pour envoyer la photo séléctionner
					</Text> : false }

					<TouchableOpacity
            disabled={this.state.photo.uri != "" ? false : true}
            onPress={()=> upload(this.state.photo) }
            style={{
              backgroundColor: this.state.photo.uri != "" ? "#BB0000" : "#555",
              width: "80%",
              height:50,
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
						}}
          >

            <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}> Publier </Text>

          </TouchableOpacity>

				</View>

			</View>
		);

	}

}
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen);
