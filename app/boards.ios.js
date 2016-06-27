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
  Dimensions,
} from 'react-native';

var Config = require('./config');
var base64 = require('base-64');
var SearchBar = require('react-native-search-bar');

const ACCESS_TOKEN = Config.ACCESS_TOKEN;

class Boards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: [],
    }
  }

  componentWillMount() {
    let p = this;
    AsyncStorage.getItem(ACCESS_TOKEN, (err, token) => {
      console.log("In boards: " + token);
      p.getBoards(token);
    });
    // FOR TEST
    // p.getBoards("eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ2NzAxMzg4NCwiaWF0IjoxNDY3MDA3ODg0fQ.eyJuZXRpZCI6Imh5NDU2In0.Zpd6-Gvyq9wRKIF7Sg7SQzSqmUFslaYFjywZi9_IoNk");
  }

  getBoards(token) {
    let p = this;

    fetch(Config.serverAddress + "api/board/", {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + base64.encode(token + ':unused'),
      },
    }).then(function(response) {
      if (response.status == 200) {
        console.log("response status is 200");
        response.json().then(function(data) {
          if (data.status == "OK") {
            p.setState({boards: data.boards});
          }
        });
      } else {
        console.log("Authorization failed");
      }
    }).catch(error => {
      console.warn(error);
    });
  }

  /**
   * Render one board.
   */
  renderBoard(board) {
    return (
      <TouchableHighlight
        key={board.id}
        style={styles.boardButton}
      >
        <Text style={styles.boardName} numberOfLines={1}>{board.name}</Text>
      </TouchableHighlight>
    );
  }

  render() {
    let boards = this.state.boards.length ?
      this.state.boards.map(board =>
        this.renderBoard(board)
      ) : (<Text style={styles.loading}>loading...</Text>);
    return (
      <View style={styles.container}>
        <SearchBar
          ref='searchBar'
          placeholder='Search'
        />
        <Text style={styles.heading}>MY BOARDS</Text>
        {boards}
      </View>
    )
  }
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.03,
    backgroundColor: '#F2F2F2',
  },
  heading: {
    fontWeight: '600',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: width * 0.02,
  },
  loading: {
    textAlign: 'center',
  },
  boardButton: {
    height: 40,
    paddingVertical: 8,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  boardName: {
    marginHorizontal: width * 0.05,
    textAlignVertical: 'center',
    fontSize: 18,
  },
});

module.exports = Boards;
