import React, { Component } from 'react';
import {
  AppRegistry,
  TabBarIOS,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  Linking,
  AsyncStorage,
} from 'react-native';

var Config = require('./config');
var Boards = require('./boards.ios');
var base64 = require('base-64');
var t = require('tcomb-form-native');
var Form = t.form.Form;

var User = t.struct({
  netid: t.String,
  password: t.String,
  remember_me: t.Boolean
});

const ACCESS_TOKEN = Config.ACCESS_TOKEN;

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        netid: this.props.netid,
        netid: "hy456",         // FOR TEST
        password: "123",
      },
    }
  }

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.post(value.netid, value.password, value.remember_me);
    }
  }

  /**
   * Get access token and store it in AsyncStorage.
   */
  async fetchAccessToken(netid, password) {
    let p = this;

    await fetch(Config.serverAddress + "api/token/", {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(netid + ':' + password),
      },
    }).then(function(response) {
      if (response.status == 200) {
        response.json().then(function(data) {
          p.storeToken(data.token);
        });
      }
    }).catch(error => {
      this.removeToken();
      console.warn(error);
    });
  }

  async storeToken(accessToken) {
    if (accessToken) {
      try {
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      } catch(error) {
        console.log("Error in storing access token.");
      }
    }
  }

  async getToken() {
    try {
      await AsyncStorage.getItem(ACCESS_TOKEN, (err, token) => {
        console.log("getToken(), token is: " + token);
        return token;
      });
    } catch(error) {
      console.log("Error in getting access token");
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(ACCESS_TOKEN);
    } catch(error) {
      console.log("Error in removing access token");
    }
  }

  post(netid, password, remember_me) {
    let data = new FormData();
    data.append("netid", netid);
    data.append("password", password);
    data.append("remember_me", remember_me);

    let p = this;

    fetch(Config.serverAddress + 'signin2/', {
      method: 'POST',
      body: data
    }).then(function(response) {
      if (response.status == 200) {
        response.json().then(function(data) {
          if (data["status"] == "OK") {   // sign in successfully
            p.fetchAccessToken(netid, password).then(() => {
              p.props.navigator.push({
                title: 'Boards',
                navigationBarHidden: true,
                component: Boards,
              });
            });

          } else {
            p.showErrorMessage(data["message"]);
          }
        });
      } else {   // response.status != 200
        response.json().then(function(data) {
          if (data["message"]) {
            p.showErrorMessage(data["message"]);
          } else {
            p.showErrorMessage("Network error. Please try again.");
          }
        });
      }
      console.log("here");
    }).catch(error => {
      p.showErrorMessage("Network error. Please try again...");
    });
  }

  showErrorMessage(errorMessage) {
    alert(errorMessage);
  }

  render() {
    var options = {
      fields: {
        password: {
            secureTextEntry: true,
        }
      }
    }

    return (
      <View style={styles.main} >
        <Text style={styles.heading}>CoCornell{'\n'}</Text>
        <Text>{this.props.message}{'\n'}</Text>
        <Form
          ref="form"
          type={User}
          value={this.state.value}
          options={options}
        />
        <TouchableHighlight style={styles.loginButton}>
          <Text style={styles.loginText} onPress={this.onPress.bind(this)}>
            Login
          </Text>
        </TouchableHighlight>

      </View>
    )
  }
}


const styles = StyleSheet.create({
  main: {
    marginTop: 70,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 46,
    color: 'red',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: "800",
  },
  label: {
    fontSize: 22,
  },
  input: {
    height: 40,
    width: 200,
    borderWidth: 2,
    borderColor: "black",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: 'red',
    width: 80,
    height: 40,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  loginText: {
    fontSize: 24,
    fontWeight: "300",
    textAlign: 'center',
  },
});

module.exports = Signin;
