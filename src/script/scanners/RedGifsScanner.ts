import { Media } from '../Media'
import Scanner from './Scanner';

export class RedGifsScanner extends Scanner {
  scan = async (html: string): Promise<Media[]> => {
    const token = await this.getToken();
    const promises: JQuery.jqXHR<any>[] = []
    console.log($(html).find('a.tile.isVideo'))
    $(html).find('a.tile.isVideo').each((i, e) => {
      const url = e.getAttribute('href')
      if (!url) return;
      
      const watchIndex = url.indexOf('/watch')
      const queryStringIndex = url.indexOf('?')
      const fileName = url.slice(watchIndex + 7, queryStringIndex)
      const promise = $.ajax({
        url: `https://api.redgifs.com/v2/gifs/${fileName}`,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      
      promises.push(promise)
    })
      
    return await Promise.all(promises).then(responses => responses.map(r => new Media(r.gif.id + '.mp4', r.gif.urls.hd, r.gif.urls.poster, r.gif.tags)))
  }

  getToken = () => $.ajax({
    url: 'https://api.redgifs.com/v2/auth/temporary',
    dataType: 'json',
    contentType: 'application/json',
  }).then(t => t.token)
}