# videojs-chapter-thumbnails

[![Build Status](https://travis-ci.org/chemoish/videojs-chapter-thumbnails.svg)](https://travis-ci.org/chemoish/videojs-chapter-thumbnails)

> Video.js plugin for supporting **WebVTT** chapter thumbnails.

![Example](https://github.com/chemoish/videojs-chapter-thumbnails/blob/master/asset/img/example.png?raw=true)

## Getting Started

#### Include

```html
<!-- optional: default styles -->
<link href="/path/to/videojs.chapter-thumbnails.min.css" rel="stylesheet">

<script src="/path/to/videojs.chapter-thumbnails.min.js"></script>
```

#### Enable

```js
videojs('player_id').chapter_thumbnails({
  src: '/path/to/chapters.vtt'
});
```

> Note: There are multiple ways to enable plugins. For more information, please visit [Video.js](https://github.com/videojs/video.js).

## Options

#### label

Type: `string`  
Default: `English`

#### language

Type: `string`  
Default: `en`

#### src

Type: `string`

#### template

Type: `Function`  
Default:

```js
template(cue = {}, textTrack) {
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
```

Provides for custom chapter templating. Must return either `HTMLElement` or `string`.

## Example WebVTT file

> Define chapters plugin by specifying a [WebVTT](http://dev.w3.org/html5/webvtt/) spec.

```
WEBVTT

Chapter 1
00:00:00.000 --> 00:00:10.000
{
  "title":"Chapter 1",
  "image":"asset/img/chapter_1.png"
}
```

## Contributing + Example

```bash
npm install -g grunt-cli

npm install

npm start
```

## License

Code licensed under [The MIT License](https://github.com/chemoish/videojs-chapter-thumbnails/blob/master/LICENSE).
