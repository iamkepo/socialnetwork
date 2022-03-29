import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView, BackHandler, TouchableOpacity, RefreshControl, Image, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from 'react-native-vector-icons';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, getPostsAction } from '../store/ActivityActions';

import { normalize } from "../utils/fonts";
import { checkversion, getposts } from "../utils/sender";

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setStateAction,
    getPostsAction
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
class HomeScreen extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      refreshing: false,
      ready: false
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
    checkversion("0.0.1").then((response)=>{
      //console.log(response.data.response);
      if (response.data.response == false) {
        this.navigation.navigate("UpdateScreen");
      }else{
        this.onRefresh();
      }
    }).catch((error)=>{
      console.log(error);
    })

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  onRefresh(){
    this.setState({refreshing: true});
    getposts().then((response)=>{
      //console.log(response.data[0]);
      this.props.getPostsAction(response.data);
      this.setState({ready: true});
    }).catch((error)=>{
      console.log(error);
    })
    wait(2000).then(() => this.setState({refreshing: false}));
  };

  render(){
    return (
      <SafeAreaView style={styles.container}>
        {
          this.state.ready ?
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={()=>this.onRefresh()} />}
          >
          {
            this.props.data.posts.map((post, i)=>(
              <View style={styles.posts} key={i}>
                <Image source={{uri: "https://iamkepo.github.io/iamkepo/IMG_20220126_121921_848.webp"}} style={{ resizeMode: "contain", height: "90%"}} />
                <Text style={styles.text} >Titre: {post.title}</Text>
              </View>
            ))
          }
          </ScrollView>
          :
          <ActivityIndicator size="large" color="f00" />
        }

        <TouchableOpacity onPress={()=> this.navigation.navigate("UploadScreen") } style={styles.newpost}>
          <Entypo name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
      </SafeAreaView>
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
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  posts: {
    width: screen.width,
    height: screen.height-110,
    display: "flex",
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FFF",
    marginBottom: 70,
    paddingBottom: 50
  },
  text: {
    fontSize: normalize(15),
    color: "#FFF"
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
