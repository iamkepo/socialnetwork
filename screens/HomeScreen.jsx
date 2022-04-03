import React from 'react';
import { Animated, StyleSheet, Dimensions, ScrollView, BackHandler, TouchableOpacity, RefreshControl, StatusBar, ActivityIndicator, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, EvilIcons, AntDesign } from 'react-native-vector-icons';
import PagerView from 'react-native-pager-view';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setStateAction, getPostsAction } from '../store/ActivityActions';

import { checkversion, getposts } from "../utils/sender";
import { normalize } from "../utils/fonts";

import PostViewComponent from "../components/PostViewComponent";

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

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
      ready: false,
      i: 0
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
    checkversion().then((response)=>{
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

  showAlert(msg){
    Alert.alert('Alert Title', msg, [
      { text: 'Voir quand meme', onPress: () => this.navigation.navigate("DiscussionScreen")},
      { text: 'OK', onPress: () => false },
    ])

  }
  render(){
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />

        <View style={styles.boxaction} >

          <TouchableOpacity
            onPress={()=> this.navigation.navigate("ProfileScreen", { user: this.props.data.user })}
            style={styles.profil}
          >
            <AntDesign name="user" size={30} color="#FFF"/>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>  this.navigation.navigate("CashScreen")}>
            <Text style={styles.text} > {this.props.data.user.solde} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={()=> this.navigation.navigate("DiscussionScreen")}
            onPress={()=> this.showAlert('Cette page est encore encours de developpement')}
          >
            <EvilIcons name="comment" size={40} color="#FFF"/>
          </TouchableOpacity>

        </View>

        {
          this.state.ready ?
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              this.state.i == 0 ?
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={()=>this.onRefresh()}
              />
              :
              false
            }
          >
            <AnimatedPager
              style={styles.pagerView}
              initialPage={this.state.i}
              onPageSelected={(e)=> this.setState({i: e.nativeEvent.position})}
              orientation="vertical"
            >
              {
                this.props.data.posts.map((post, i)=>(
                  <PostViewComponent key={i}
                    repost={()=>this.navigation.navigate('UploadScreen', { post: post })}
                    gotouser={()=> this.navigation.navigate("ProfileScreen", { user: post.user })}
                    gotocomment={()=> this.navigation.navigate("CommentScreen", { post: post })}
                    post={post}
                    i={i}
                    onScreen={this.state.i}
                    onRefresh={()=>this.onRefresh()}
                  />
                ))
              }
            </AnimatedPager>
          </ScrollView>
          :
          <ActivityIndicator size="large" color="F00" />
        }

        <TouchableOpacity onPress={()=> this.navigation.navigate("UploadScreen", { post: undefined })} style={styles.newpost}>
          <Entypo name="plus" size={30} color="#FFF"/>
        </TouchableOpacity>

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
  boxaction: {
    width: "100%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    zIndex: 5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: "1%"
  },
  profil: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F00",
    borderRadius: 50,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
      width: 10
    },
    shadowOpacity: 0.5,
    elevation : 10,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: normalize(18),
    color: "#FFF",
  },
  newpost: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F00",
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
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
