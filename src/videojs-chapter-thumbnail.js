/* global videojs */

import './videojs-chapter-thumbnail.scss';

import * as MenuChapterThumbnailMenuButton from './menu/chapter-thumbnail-menu-button';
import TRACK_ID from './track/text-track';

const {
  CHAPTER_THUMBNAIL_MENU_BUTTON_NAME,
  ChapterThumbnailMenuButton,
} = MenuChapterThumbnailMenuButton;

/**
 * @name Chapters Plugin
 * @description
 * Define chapters plugin by specifying a WebVTT spec.
 * http://dev.w3.org/html5/webvtt/
 *
 * Abide by the following:
 *
 * @example
 * WEBVTT
 *
 * 00:00:00.000 --> 00:10:00.000
 * {
 *   "title":"Introduction",
 *   "image":"http://www.example.com/example.jpg"
 * }
 *
 * @example
 * videojs('playerId', {
 *   plugins: {
 *     chapter_thumbnails: {
 *       label: 'English',
 *       language: 'en',
 *       src: 'chapters.vtt'
 *     }
 *   }
 * });
 *
 * videojs('player_id').chapter_thumbnails({
 *   label: 'English',
 *   language: 'en',
 *   src: 'chapters.vtt'
 * });
 *
 * @param {Object} player VideoJS player
 * @param {Object} options={}
 * @param {string} [options.label=English]
 * @param {string} [options.language=en]
 * @param {string} options.src
 * @param {Function} [options.template] Generates template for chapter thumbnail menu item
 */

export default class ChapterThumbnails {
  constructor(player, options = {}) {
    const defaults = {
      label: 'English',
      language: 'en',
    };

    this.player = player;

    this.textTrack = videojs.mergeOptions(defaults, options, {
      default: false,
      id: TRACK_ID,
      kind: 'metadata',
      mode: 'disabled',
    });

    this.template = this.textTrack.template;
  }

  addComponent() {
    const controlBar = this.player.getChild('controlBar');

    const chapterButton = controlBar.getChild('chaptersButton');

    let chapterThumbnailMenuButton = controlBar.getChild(CHAPTER_THUMBNAIL_MENU_BUTTON_NAME);

    // remove existing menu—menu button will be hidden if there are no items found
    if (chapterThumbnailMenuButton && chapterThumbnailMenuButton.menu) {
      chapterThumbnailMenuButton.menu.dispose();

      delete chapterThumbnailMenuButton.menu;
    } else {
      const MenuButton = (
        videojs.getComponent('ChapterThumbnailMenuButton') || ChapterThumbnailMenuButton
      );

      chapterThumbnailMenuButton = new MenuButton(this.player, {
        name: CHAPTER_THUMBNAIL_MENU_BUTTON_NAME,
        template: this.template,
      });

      // add component to end of control bar
      controlBar.addChild(chapterThumbnailMenuButton);

      // move component—there is no component index placement
      controlBar.el().insertBefore(chapterThumbnailMenuButton.el(), chapterButton.el());
    }

    this.addTextTrack();
  }

  addTextTrack() {
    const currentTextTrack = this.player.remoteTextTracks().getTrackById(TRACK_ID);

    // remove existing track
    if (currentTextTrack) {
      this.player.removeRemoteTextTrack(currentTextTrack);
    }

    // add new track
    this.player.addRemoteTextTrack(this.textTrack, false);
  }
}

videojs.plugin('chapter_thumbnails', function chapterThumbnails(options) {
  const chapterThumbnail = new ChapterThumbnails(this, options);

  chapterThumbnail.addComponent();
});
