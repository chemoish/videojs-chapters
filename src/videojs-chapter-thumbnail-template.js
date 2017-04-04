const defaults = {
  template(cue = {}) {
    let cueText;

    // NOTE: if `cue.text` isn't parseable, just send it through instead of blowing up.
    // DRAGON: this probably opens up a possible script injection
    try {
      cueText = JSON.parse(cue.text || '{}');
    } catch (e) {
      cueText = cue.text;
    }

    const {
      image,
      title,
    } = cueText;

    const template = document.createElement('div');
    template.className = 'vjs-chapters-thumbnails-item';

    if (image) {
      const img = document.createElement('img');
      img.className = 'vjs-chapters-thumbnails-item-image';
      img.src = image;

      template.appendChild(img);
    }

    if (title) {
      const span = document.createElement('span');
      span.className = 'vjs-chapters-thumbnails-item-title';
      span.innerHTML = title;

      template.appendChild(span);
    }

    return template;
  },
};

/**
 * @name Chapter Thumbnail Template
 * @description
 * Converts the WebVTT cue into an HTMLElement template.
 *
 * @example
 * chapterThumbnailTemplate({
 *   text: '{"title":"Hello World"}',
 * }, {
 *   template(cue, textTrack) {
 *     let cueText;
 *
 *     // NOTE: if `cue.text` isn't parseable, just send it through instead of blowing up.
 *     // DRAGON: this probably opens up a possible script injection
 *     try {
 *       cueText = JSON.parse(cue.text || '{}');
 *     } catch (e) {
 *       cueText = cue.text;
 *     }
 *
 *     const template = document.createElement('div');
 *
 *     template.innerHTML = cueText.title;
 *
 *     return template;
 *   }
 * });
 *
 * @param {TextTrackCue} cue={}
 * @param {Object} options={}
 * @param {Function} [options.template]
 * @returns {HTMLElement|string} template
 */

function chapterThumbnailTemplate(cue = {}, options = {}) {
  const template = options.template || defaults.template;

  return template(cue, options.textTrack);
}

export default chapterThumbnailTemplate;
