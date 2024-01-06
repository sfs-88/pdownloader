import { Media } from '../Media'

export default class Scanner {
  scan = async (): Promise<Media[]> => {
    throw new Error('Method scan() not implemented.')
  }
}