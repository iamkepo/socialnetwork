/** Importation globale : */
import React from 'react';
import { SafeAreaView, View, Dimensions, Text, TouchableOpacity, BackHandler, Image, TextInput, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { SimpleLineIcons, Ionicons, AntDesign, MaterialIcons } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, setPostAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { setpost, setcomment, getcomments, getpost } from "../utils/sender";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
    setPostAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { data } = state
  return { data }
};

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const screen = Dimensions.get("screen");

class CommentScreen extends React.Component {

	constructor(props) {
		super(props);
    this.state= {
      comments: [],
      comment: "",
      refreshing: false,
      height: "80%",
      tab: []
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
    //console.log(this.route.params.post);
    this.setState({tab: this.route.params.post.comment});

    this.onRefresh();

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  onRefresh(){
    this.setState({refreshing: true});
    getcomments(this.route.params.post._id).then((response)=>{
      //console.log(response.data);
      this.setState({comments: response.data});
    }).catch((error)=>{
      console.log("getcomments: "+error);
    })
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  pushcomment(){
    var data = {
      user: this.props.data.user,
      post_id: this.route.params.post._id,
      comment: this.state.comment,
      type: "text"
    };
    setcomment(data)
    .then((response)=>{
      //console.log(response.data);
      this.setState({comment: '', comments: [ data, ...this.state.comments]});
      if (response.data.insertedId) {
        setpost({ post_id: this.route.params.post._id, option: "commentpush", value: response.data.insertedId});
      }
    })
    .catch((error)=> console.log(error))
  }

  deletecomment(data){
    setcomment(data)
    .then((response)=>{
      //console.log(response.data);
      if (response.data.deletedCount == 1) {
        setpost({ post_id: this.route.params.post._id, option: "commentremove", value: data._id})
      }
      this.onRefresh();
    })
    .catch((error)=> console.log(error))
  }

  back() {
    getpost(this.route.params.post._id).then((response)=>{
      //console.log(response.data);
      //console.log(this.props.data.posts.indexOf(this.route.params.post))
      this.props.setPostAction(this.props.data.posts.indexOf(this.route.params.post), response.data);
    }).catch((error)=>{
      console.log(error);
    })
    this.navigation.goBack()
  }
	render() {
		return (
			<SafeAreaView style={styles.container}>

        <View style={styles.head}>

          <TouchableOpacity onPress={()=> this.back()}>
            <Ionicons name="arrow-back" size={30} color="#FFF"/>
          </TouchableOpacity>

          <Text style={styles.title}>
            Commentaires
          </Text>

          <TouchableOpacity onPress={()=> false}>
            <SimpleLineIcons name="options-vertical" size={20} color="#FFF"/>
          </TouchableOpacity>

        </View>
        <View style={[styles.sous, {height: this.state.height}]}>
          {
            this.state.comments.length > 0 ?
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
                this.state.comments.map((comment, i)=>(
                  <View key={i} style={styles.discussion}>
                    <TouchableOpacity
                      onPress={()=> this.navigation.navigate("ProfileScreen", { user: comment.user._id == this.props.data.user._id ? this.props.data.user : comment.user })}
                      style={styles.profil}
                    >
                      {
                        comment.user.photo == "" ?
                        <AntDesign name="user" size={normalize(20)} color="#FFF"/>
                        :
                        <Image source={{uri: comment.user.photo}} resizeMode="cover" style={{width: "100%", height: "100%"}} />
                      }
                    </TouchableOpacity>
                    <View style={styles.textbox}>
                      <Text style={styles.name}>
                        {comment.user.psoeudo == "" ? comment.user._id : comment.user.psoeudo}
                      </Text>
                      <Text style={styles.comment}> {comment.comment} </Text>
                    </View>
                    {comment.user._id == this.props.data.user._id ?
                    <TouchableOpacity onPress={()=> 
                      Alert.alert('Supprimer ce commentaire', 'Voulez vous vraiment supprimer cette commentaire ?', [
                        {
                          text: 'Annuler',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        { text: 'OK', onPress: () => this.deletecomment(comment) },
                      ])
                    }>
                      <MaterialIcons name="delete" size={20} color="#F00"/>
                    </TouchableOpacity>
                    : <MaterialIcons name="delete" size={20} color="#000"/>
                    }
                  </View>
                ))
              }
              <View style={{height: 30}} />
            </ScrollView>
            :
            <Text style={styles.text}> Aucun commentaire disponible pour le moment </Text>
          }

        </View>

        <View style={styles.sendbox}>
          <TextInput
            style={[styles.input, {height: this.state.height == "80%" ? "60%" : "100%"}]}
            onChangeText={(text)=> this.setState({comment: text})}
            value={this.state.comment}
            placeholder="Ecrivez votre commentaire ici ..."
            placeholderTextColor={"#FFF"}
            multiline={true}
            textAlignVertical="top"
            keyboardType="default"
            onBlur={()=> this.setState({height: "80%"})}
            onFocus={()=> this.setState({height: "60%"})}
          />

          <TouchableOpacity
            onPress={()=> this.pushcomment()}
            disabled={this.state.comment != "" ? false : true}
            style={[styles.btnsend, {
              backgroundColor: this.state.comment != "" ? "#F00" : "#555",
              height: this.state.height == "80%" ? "60%" : "100%"
            }]}
          >
            <MaterialIcons name="send" size={30} color="#FFF"/>

          </TouchableOpacity>

        </View>
			</SafeAreaView>
		);

	}

}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "space-between"
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
    minHeight: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#FFF",
    borderRadius: 20,
    marginTop: "5%",
    padding: "2%"
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
    width: "75%",
    height: "100%",
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
  sendbox: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly"
  },
  input: {
    width: "80%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFF",
    marginVertical: "5%",
    color: "#FFF",
    padding: 10,
  },
  btnsend: {
    width: "13%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  text: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: "#FFF"
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen);
