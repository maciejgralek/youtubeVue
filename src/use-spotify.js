import axios from 'axios'
import { createUrl } from './tools.js'

let clientId = '9913b1c9730a485090db34513d4b3d3a';
let clientSecret = 'e6a284527e4249d4b1cfee4ce9034e5b';
let spotifyAuthorizationURL = 'https://accounts.spotify.com/api/token';
llet spotifyAuthorizationHeaders = {
  'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
}et spotifyAuthorizationHeaders = {
  'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
}
let accessToken = '';
let player = null;

window.onSpotifyWebPlaybackSDKReady = async () => {
  // await authorizeClient();
  await authorizeUser();

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

async function authorizeUser() {
  let res = await axios.get('http://localhost:3000/spotifyvue/login')
}

async function authorizeClient() {
  try {
    let res = await axios.post(
      spotifyAuthorizationURL, 
      'grant_type=client_credentials', 
      {
        headers: spotifyAuthorizationHeaders
      }
    )
    accessToken = res.data.access_token;
  }
  catch (err) {
    console.log(err)
  }
}

export default function useSpotify() {
  return {
    
  }
}
