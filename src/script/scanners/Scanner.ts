import { Media } from '../Media'

export default class Scanner {
  scan = async (html: string): Promise<Media[]> => {
    throw new Error('Method scan() not implemented.')
  }
}