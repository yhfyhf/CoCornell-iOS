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
    // p.getBoards("eyJhbGciOiJIUzI1NiIsImV4cCI6MTQ2NjkyOTU1MSwiaWF0IjoxNDY2OTIzNTUxfQ.eyJuZXRpZCI6Imh5NDU2In0.y6BX9rQbDjwQUX-VnDkqwigKobkXfZoTYv4fYbNdPBM");
  }

  getBoards(token) {
    let p = this;

    fetch(Config.serverAddress + "api/board/", {
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+btoa(token + ':unused')
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
      <TouchableHighlight key={board.id} style={styles.boardButton}>
        <Text style={styles.boardName}>{board.name}</Text>
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
    marginTop: height * 0.1,
  },
  heading: {
    fontWeight: '600',
    fontSize: 24,
  },
  loading: {
    textAlign: 'center',
  },
  boardButton: {
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
  },
  boardName: {
    marginLeft: width * 0.1,
  },
});

module.exports = Boards;
