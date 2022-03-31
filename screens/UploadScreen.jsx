/** Importation globale : */
import React from 'react';
import { View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet } from 'react-native';
import { Entypo, Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';

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
    this.state= {
      file: {},
      description: "",
      step: 0,
      uri: false,
    }
    this.navigation = this.props.navigation;
    this.route = this.props.route;
  }

  generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        this.route.params.post.uri,
        { time: 1 }
      );
      this.setState({uri: uri});
    } catch (e) {
      this.generateThumbnail()
    }
  };

  backAction = () => {
    this.back();
    return true;
  };

  componentWillUnmount() {
   this.backHandler.remove();
  }


  componentDidMount(){

    if (this.route.params.post != undefined) {
      this.setState({
        file: this.route.params.post,
        description: this.route.params.post.description,
        step: 1
      });
      if (this.route.params.post.type == "video") {
        this.generateThumbnail();
      }
    }

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
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
    if (this.state.step > 0) {
      this.setState({step: this.state.step-1})
    } else {
      this.navigation.goBack()
    }
  }
	render() {
		return (
			<View style={{ width: "100%", height: "100%", backgroundColor: "#000", alignItems: "center",  justifyContent: "flex-start" }}>
        <TouchableOpacity
          onPress={()=> this.back()}
          style={{ width: "95%", height: 50, alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}
        >
          <Ionicons name="arrow-back" size={30} color="#FFF"/>
          <Text style={{width: "80%",fontSize: normalize(20), fontWeight: "bold", color: "#FFF", }}>
            New Poste
          </Text>
        </TouchableOpacity>
        {
          this.state.step == 0 ?


          <View  style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "flex-start" }}>

            <Text style={{width: "95%", marginVertical: "5%", textAlign: "center",fontSize: normalize(18), fontWeight: "bold", color: "#FFF", }}>
              Cliquer pour séléctionner une photo ou un video
            </Text>
            {
              this.state.file.uri != undefined ?
              <View style={styles.cadre} >
                <Image
                  source={{ uri: this.state.uri ? this.state.uri : this.state.file.uri  }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
              :
              <View style={styles.boxaction}>
                {
                  this.state.file.type == "image" ?
                  <>
                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Images, 3)} style={styles.mini}>
                      <Text style={styles.text}> 4, 3 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Images, 4)} style={styles.mini}>
                      <Text style={styles.text}> 4, 4 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Images, 5)} style={styles.mini}>
                      <Text style={styles.text}> 4, 5 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Images, 6)} style={styles.mini}>
                      <Text style={styles.text}> 4, 6 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Images, 7)} style={styles.mini}>
                      <Text style={styles.text}> 4, 7 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Images, 8)} style={styles.mini}>
                      <Text style={styles.text}> 4, 8 </Text>
                    </TouchableOpacity>
                  </>
                  :
                  <>
                    <TouchableOpacity onPress={()=> this.setState({file: { ...this.state.file, type: "image"}})} style={styles.newpost}>
                      <Text style={styles.text}> Photo </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=> this.pickImage(ImagePicker.MediaTypeOptions.Videos)} style={styles.newpost}>
                      <Text style={styles.text}> video </Text>
                    </TouchableOpacity>
                  </>
                }

              </View>
            }

            <TouchableOpacity
              disabled={this.state.file.uri != undefined ? false : true}
              onPress={()=> this.setState({step: 1})}
              style={{
                backgroundColor: this.state.file.uri != undefined ? "#BB0000" : "#555",
                width: "95%",height:50,justifyContent: "center",borderRadius: 50,marginTop: "15%"
              }}
            >

              <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}>
                Suivant
              </Text>

            </TouchableOpacity>

          </View>
          :
          <View  style={{ width: "100%", height: "90%", alignItems: "center", justifyContent: "flex-start" }}>

            <Text style={{width: "95%", marginVertical: "5%", textAlign: "center",fontSize: normalize(18), fontWeight: "bold", color: "#FFF", }}>
              Cliquer dans le champ pour ajouter une description
            </Text>

            <TextInput
              style={{
                width: "95%",
                height: "20%",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#FFF",
                marginVertical: "5%",
                color: "#FFF",
                padding: 10
              }}
              onChangeText={()=>this.setState({description})}
              value={this.state.description}
              multiline={true}
              autoFocus={true}
              textAlignVertical="top"
              ch
            />

            <TouchableOpacity
              onPress={()=> {
                upload({ file: this.state.file, user: this.props.data.user, description: this.state.description }).then( (response)=> {
                  //console.log(response.data);
                  this.navigation.reset({ index: 0, routes: [{ name: 'MainNavigator' }]});
                })
                .catch( (error)=> {
                  console.log("upload: "+error);
                });
              }}
              style={{
                backgroundColor: "#BB0000",
                width: "95%",
                height:50,
                justifyContent: "center",
                borderRadius: 50,
                marginTop: "10%"
              }}
            >

              <Text style={{ color: "#FFF", fontSize: normalize(14), textAlign: "center" }}>
                Publier
              </Text>

            </TouchableOpacity>

          </View>

        }

			</View>
		);

	}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#000",
  },
  boxaction: {
    width: "95%",
    height: "20%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginVertical: "5%",
  },
  cadre: {
    width: "95%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    overflow: "hidden"
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mini: {
    width: "20%",
    height: "45%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    marginHorizontal: "5%",
    overflow: "hidden"
  },
  text: {
    width: "95%",
    marginVertical: "5%",
    textAlign: "center",
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF",
  },
  newpost: {
    width: "45%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    overflow: "hidden"
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(UploadScreen);
