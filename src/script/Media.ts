export class Media {
  filename: string
  url: string
  thumbnail: string
  tags: string[] | undefined

  constructor(filename: string, url: string, thumbnail: string, tags: string[] | undefined = undefined) {
    this.filename = filename
    this.url = url
    this.thumbnail = thumbnail
    this.tags = tags
  }
}
