import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  AsyncStorage,
} from 'react-native';

var Home = require('./app/home.ios');
var Boards = require('./app/boards.ios');
var BoardPage = require('./app/boardPage');


class CoCornellApp extends Component {

  render() {
    AsyncStorage.getItem("acces_token", function(err, token) {
      console.log("In index, token is " + token);
    });

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: "Home",
          navigationBarHidden: true,
          component: Home,
          // component: BoardPage,   // FOR TEST
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

AppRegistry.registerComponent('CoCornellApp', () => CoCornellApp);
