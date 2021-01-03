import axios from 'axios'

let clientId = '9913b1c9730a485090db34513d4b3d3a';
let clientSecret = 'e6a284527e4249d4b1cfee4ce9034e5b';
let spotifyAuthorizationURL = 'https://accounts.spotify.com/api/token';
let spotifyAuthorizationHeaders = {
  'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
}

async function authorize() {
  try {
    let res = await axios.post(
      spotifyAuthorizationURL, 
      'grant_type=client_credentials', 
      {
        headers: spotifyAuthorizationHeaders
      }
    )
    console.log(res)
  }
  catch (err) {
    console.log(err)
  }
}

export default function useSpotify() {
  return {
    authorize,
  }
}
