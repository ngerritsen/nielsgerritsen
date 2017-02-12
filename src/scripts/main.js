import $ from 'jquery'
import moment from 'moment'

$(document).ready(() => {
  autoSetAge()
  toggleThumbnailViews()
})

function autoSetAge() {
  const birth = moment('18-07-1989', 'DD-MM-YYYY')
  const now = moment()
  const age = now.diff(birth, 'years')
  const ageString = String(age) + ' year old '

  $('.js-age').text(ageString)
}

function toggleThumbnailViews() {
  $('.js-publication').each(toggleThumbnailView)
}

function toggleThumbnailView() {
  const $publication = $(this) // eslint-disable-line no-invalid-this
  const $onToggle = $publication.find('.js-publication-on')
  const $offToggle = $publication.find('.js-publication-off')
  const $meta = $publication.find('.js-publication-meta')

  $onToggle.click(() => {
    $meta.addClass('show')
    $onToggle.fadeOut(200)
  })

  $offToggle.click(() => {
    $meta.removeClass('show')
    $onToggle.fadeIn(200)
  })
}
