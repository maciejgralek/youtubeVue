import useYoutube from '../../src/use-youtube'
import axios from 'axios'

let {
  getPlaylistRemote,
  addPlaylist,
} = useYoutube();

jest.mock('axios')

describe('useYoutube', () => {
  it('test', async () => {
    axios.get.mockResolvedValue({
      data: {
        items: [
          {
            id: 1,
            snippet: {
              description: 'test',
              title: 'test',
            },
            title: 'test',
          }
        ]
      }
    })

    let playlist = addPlaylist('test', false);
    await getPlaylistRemote(playlist);
    console.log(playlist)
  })
})


