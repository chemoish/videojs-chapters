import chapterThumbnailTemplate from '../src/videojs-chapter-thumbnail-template';

describe('chapter-thumbnail-template.js', function () {
    it('should return the unaltered default template.', function () {
        expect(chapterThumbnailTemplate({
            text: null
        })).toBe(
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="{{image}}" />
    <span class="vjs-chapters-thumbnails-item-title">{{title}}</span>
</div>
`
        );
    });

    it('should return the modified default template when receiving non JSON data.', function () {
        expect(chapterThumbnailTemplate({
            text: "example"
        })).toBe(
            `
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="" />
    <span class="vjs-chapters-thumbnails-item-title">example</span>
</div>
`
        );
    });

    it('should return the modified default template.', function () {
        expect(chapterThumbnailTemplate({
            text: JSON.stringify({
                image: 'http://example.com',
                title: 'example'
            })
        })).toBe(
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="http://example.com" />
    <span class="vjs-chapters-thumbnails-item-title">example</span>
</div>
`
        );

        expect(chapterThumbnailTemplate({
            text: JSON.stringify({
                image: 'http://example.com'
            })
        })).toBe(
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="http://example.com" />
    <span class="vjs-chapters-thumbnails-item-title">{{title}}</span>
</div>
`
        );
    });

    it('should return the enhanced template.', function () {
        expect(chapterThumbnailTemplate({
            text: JSON.stringify({
                description: 'example description',
                image: 'http://example.com',
                title: 'example title'
            })
        }, {
            template: (
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="{{image}}" />
    <span class="vjs-chapters-thumbnails-item-title">{{title}}</span>
    <p class="vjs-chapters-thumbnails-item-description">{{description}}</p>
</div>
`
            )
        })).toBe(
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="http://example.com" />
    <span class="vjs-chapters-thumbnails-item-title">example title</span>
    <p class="vjs-chapters-thumbnails-item-description">example description</p>
</div>
`
        );

        expect(chapterThumbnailTemplate({
            text: JSON.stringify({
                image: 'http://example.com',
                title: 'example title'
            })
        }, {
            template: (
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="{{image}}" />
    <span class="vjs-chapters-thumbnails-item-title">{{title}}</span>
    <p class="vjs-chapters-thumbnails-item-description">{{title}}</p>
</div>
`
            )
        })).toBe(
`
<div class="vjs-chapters-thumbnails-item">
    <img class="vjs-chapters-thumbnails-item-image" src="http://example.com" />
    <span class="vjs-chapters-thumbnails-item-title">example title</span>
    <p class="vjs-chapters-thumbnails-item-description">example title</p>
</div>
`
        );
    });
});
