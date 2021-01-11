import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { createUrl } from './tools.js'

let clientId = '9913b1c9730a485090db34513d4b3d3a';
let clientSecret = 'e6a284527e4249d4b1cfee4ce9034e5b';
// let herokuRemote = 'https://youtube-vue-server.herokuapp.com/spotifyvue/login'
let herokuRemote = 'http://localhost:3000/spotifyvue'
let accessToken = ref('');
let refreshToken = ref('');
let playlist = ref({});
let player = null;

window.onSpotifyWebPlaybackSDKReady = async () => {
  // player = new Spotify.Player({
  //   name: 'Carly Rae Jepsen Player',
  //   getOAuthToken: callback => {
  //     callback(accessToken);
  //   },
  //   volume: 0.5
  // });

  //   player.connect().then(success => {
  //   if (success) {
  //     console.log('The Web Playback SDK successfully connected to Spotify!');
  //   }
  // })

  // axios.put(
  //   'https://api.spotify.com/v1/me/player/play', 
  //   {
  //     "uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
  //   }, 
  //   {
  //     headers: {
  //       'Authorization': 'Bearer ' + accessToken,
  //     }
  //   })
  //   .then(res => { console.log(res) })
  //   .catch((err) => { console.log(err.response) })
};

function authorizeUser() {
  window.location.href = herokuRemote + '/login';
}

function getAccessToken() {
  return axios.post(
    herokuRemote + '/refresh_token', 
    {
      refresh_token: refreshToken.value
    })
    .then((res) => {
      accessToken.value = res.data.access_token;
    })
}

function getPlaylist() {
  let authorizationHeaders = {
    'Authorization': 'Bearer ' + accessToken.value,
  }
  let res =  axios.get(
    'https://api.spotify.com/v1/playlists/0JlDui20DRDOVUqhzA2na4', 
    {
      headers: authorizationHeaders 
    })
    .then((res) => {
      playlist.value = res.data;
      console.log(res)
    })
}

export default function useSpotify() {
  return {
    authorizeUser,
    accessToken,
    playlist,
    getPlaylist,
    refreshToken,
    getAccessToken,
  }
}
