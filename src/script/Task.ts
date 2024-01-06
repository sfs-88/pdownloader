import { Media } from "./Media";

export class Task {
  media: Media
  targetFilename: string
  element: JQuery
  download = false
  downloader?: any

  constructor(media: Media, targetFilename: string, element: JQuery) {
    this.media = media
    this.targetFilename = targetFilename
    this.element = element
  }
}