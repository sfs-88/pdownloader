import JsFileDownloader from 'js-file-downloader'
import { Media } from './Media'
import { Task } from './Task'

const tasks: Task[] = []

$(async () => {
  const values = await chrome.storage.local.get('media')
  const savedMedia: Media[] = values['media']
  if (!savedMedia) return

  const container = $('.media-container')
  savedMedia.forEach(m => {
    const row = getMediaRow(m)
    tasks.push(new Task(m, m.filename, row))

    container.append(row)
  })

  $('#downloadChecked').on('click', downloadChecked)
  $('#includeTags').on('click', toggleTags)
  $('#checkAll').on('click', () => checkAll(true))
  $('#uncheckAll').on('click', () => checkAll(false))
  $('#checkBatch').on('click', () => checkNext(50))
})

const downloadChecked = async () => {
  const downloadTasks = tasks.filter(t => t.download)
  downloadTasks.forEach(t => {
    t.downloader = new JsFileDownloader({
      url: t.media.url,
      filename: t.targetFilename,
      autoStart: false,
      process: (e) => downloadProgress(e, t.element)
    })
  })

  let position = 0
  const batchSize = 5
  while (position < downloadTasks.length) {
    const batchTasks = downloadTasks.slice(position, position + batchSize)
    await Promise.all(batchTasks.map(t => t.downloader?.start().then(() => taskComplete(t))))
    position += batchSize
  }

  updateDownloadButton()
}

const taskComplete = (task: Task) => {
  task.element.remove()
  const index = tasks.indexOf(task);
  if (index > -1) {
    tasks.splice(index, 1);
  }
}

const downloadProgress = (e: ProgressEvent, row: JQuery): undefined => {
  if (!e.lengthComputable) return

  const progressBar = row.find('.progress-bar').show()
  const downloadingPercentage = e.loaded / e.total
  const progressBarWidth = downloadingPercentage * (progressBar.width() ?? 0)
  progressBar.find('div').width(progressBarWidth)
};

const getMediaRow = (media: Media) => {
  const row = $('<tr class="media-row">')
  const check = $(`<input class="row-check" type="checkbox">`).on('click', (e) => {
    const match = tasks.find(t => t.media.filename === media.filename)
    if (!match) return

    match.download = $(e.currentTarget).prop('checked')
    updateDownloadButton()
  })
  const cell = $('<td/>').append(check)
  row.append(cell)

  const thumb = $(`<td><img class="thumbnail" src="${media.thumbnail}" /></td>`).on('click', () => check.trigger('click'))
  row.append(thumb)

  const details = $(`<td class="detail-cell"><span class="label">FILENAME:</span> <span class="media-name">${media.filename}</span></td>`)
  if (media.tags && media.tags.length > 0) {
    details.append(`<br/><span class="label">TAGS:</span> <span>${media.tags.map(t => `[${t}]`).join('')}</span>`)
  }

  const progress = $(`<div class="progress-bar tiny-green"><div></div></div>`).hide()
  details.append(progress)

  row.append(details)

  return row
}

const toggleTags = (e: JQuery.ClickEvent) => {
  const includeTags = $(e.currentTarget).prop('checked')
  tasks.forEach(t => {
    if (includeTags && t.media.tags) {
      t.targetFilename = t.media.tags.map(tag => `[${tag}]`).join('') + t.media.filename
    }
    else {
      t.targetFilename = t.media.filename
    }

    t.element.find('.media-name').text(t.targetFilename)
  })
}

const checkAll = (doCheck: boolean) => {
  tasks.forEach(t => {
    t.download = doCheck
    t.element.find('.row-check').prop('checked', doCheck)
  })

  updateDownloadButton()
}

const checkNext = (batchSize: number) => {
  checkAll(false)
  const tasksToCheck = tasks.slice(0, batchSize)
  tasksToCheck.forEach(t => {
    t.download = true
    t.element.find('.row-check').prop('checked', true)
  })

  updateDownloadButton()
}

const updateDownloadButton = () => $('#downloadChecked').text(`Download (${tasks.filter(t => t.download).length})`)
