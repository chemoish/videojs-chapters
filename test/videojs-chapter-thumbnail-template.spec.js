import chapterThumbnailTemplate from '../src/videojs-chapter-thumbnail-template';

function trim(string) {
  return string.replace(/>[\s]+</g, '><').trim();
}

describe('chapter-thumbnail-template.js', () => {
  let customTemplate;

  beforeEach(() => {
    customTemplate = document.createElement('div');
  });

  it('should return an empty default template.', () => {
    expect(chapterThumbnailTemplate({
      text: null,
    }).outerHTML).toBe(
      trim(`
        <div class="vjs-chapters-thumbnails-item"></div>
      `)
    );
  });

  it('should return the modified default template.', () => {
    expect(chapterThumbnailTemplate({
      text: JSON.stringify({
        image: 'http://example.com',
        title: 'example',
      }),
    }).outerHTML).toBe(
      trim(`
        <div class="vjs-chapters-thumbnails-item">
          <img class="vjs-chapters-thumbnails-item-image" src="http://example.com">
          <span class="vjs-chapters-thumbnails-item-title">example</span>
        </div>
      `)
    );

    expect(chapterThumbnailTemplate({
      text: JSON.stringify({
        image: 'http://example.com',
      }),
    }).outerHTML).toBe(
      trim(`
        <div class="vjs-chapters-thumbnails-item">
          <img class="vjs-chapters-thumbnails-item-image" src="http://example.com">
        </div>
      `)
    );
  });

  it('should return a custom template.', () => {
    const template = chapterThumbnailTemplate({
      text: JSON.stringify({
        description: 'example description',
      }),
    }, {
      template(cue) {
        let cueText;

        try {
          cueText = JSON.parse(cue.text || '{}');
        } catch (e) {
          cueText = cue.text;
        }

        const span = document.createElement('span');

        span.innerHTML = cueText.description;

        customTemplate.appendChild(span);

        return customTemplate;
      },
    });

    expect(template.outerHTML).toBe(
      trim(`
        <div>
          <span>example description</span>
        </div>
      `)
    );
  });

  it('should return an template for invalid JSON.', () => {
    const template = chapterThumbnailTemplate({
      text: 'example title',
    }, {
      template(cue) {
        let cueText;

        try {
          cueText = JSON.parse(cue.text || '{}');
        } catch (e) {
          cueText = cue.text;
        }

        customTemplate.innerHTML = cueText;

        return customTemplate;
      },
    });

    expect(template.outerHTML).toBe(
      trim(`
        <div>example title</div>
      `)
    );
  });
});
