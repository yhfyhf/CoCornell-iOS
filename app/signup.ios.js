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
} from 'react-native';

var Config = require('./config');
var Signin = require('./signin.ios');
var t = require('tcomb-form-native');
var Form = t.form.Form;

var User = t.struct({
  netid: t.String,
  password: t.String,
  name: t.String,
});

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      this.post(value.netid, value.password, value.name);
    }
  }

  post(netid, password, name) {
    var payload = {
      netid: netid,
      password: password,
      name: name,
    };

    var data = new FormData();
    data.append("netid", netid);
    data.append("password", password);
    data.append("name", name);

    var p = this;

    fetch(Config.serverAddress + 'api/signup/', {
      method: 'POST',
      body: data
    }).then(function(response) {
      if (response.status == 200) {
        response.json().then(function(data) {
          if (data["status"] == "OK") {
            p.props.navigator.push({
              title: 'Signin',
              navigationBarHidden: true,
              component: Signin,
              passProps: {
                netid: data.user.netid,
                message: "Sign up successfully.",
              },
            });
          } else {
            p.showErrorMessage(data["message"]);
          }
        });
      } else {   // response.status != 200
        response.json().then(function(data) {
          console.log(data);
          if (data["message"]) {
            p.showErrorMessage(data["message"]);
          } else {
            p.showErrorMessage("Network error. Please try again.");
          }
        });
      }
    }).catch(error => {
      p.showErrorMessage("Network error. Please try again.");
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
        <Text style={styles.heading}>CoCornell</Text>
        <Form
          ref="form"
          type={User}
          options={options}
        />
        <TouchableHighlight style={styles.loginButton}>
          <Text style={styles.loginText} onPress={this.onPress.bind(this)}>
            Sign up
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

module.exports = Signup;
