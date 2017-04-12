/* global videojs */

import { ChapterThumbnailMenu, CHAPTER_THUMBNAIL_MENU_NAME } from './chapter-thumbnail-menu';
import ChapterThumbnailMenuItem from './chapter-thumbnail-menu-item';
import TRACK_ID from '../track/text-track';

const CHAPTER_THUMBNAIL_MENU_BUTTON_NAME = 'ChapterThumbnailMenuButton';

/**
 * @name Chapter Thumbnails Button
 * @description
 * Define the chapter thumbnails menu button component.
 * Create the chapter thumbnails menu and attach it to the player.
 *
 * @param {Object} player VideoJS player
 * @param {Object} options={}
 * @param {string} options.name Component name
 * @param {string} [options.template]
 */

const VjsMenuButton = videojs.getComponent('MenuButton');

class ChapterThumbnailMenuButton extends VjsMenuButton {
  constructor(player, options = {}) {
    super(player, options);

    const tracks = this.player().remoteTextTracks();

    // hide the button if there are no items
    if (this.items.length <= 0) {
      this.hide();
    }

    // do not set any events unless tracks are available
    if (!tracks) {
      return;
    }

    // NOTE: https://github.com/videojs/video.js/blob/master/src/js/control-bar/text-track-controls/text-track-button.js
    // Events follow videojs.TextTrackButton

    this.update = this.update.bind(this);

    tracks.addEventListener('addtrack', this.update);
    tracks.addEventListener('removetrack', this.update);

    this.player().on('dispose', () => {
      tracks.removeEventListener('addtrack', this.update);
      tracks.removeEventListener('removetrack', this.update);
    });

    this.addClass('vjs-chapter-thumbnails-button');
    this.addClass('vjs-chapters-button');

    this.el_.setAttribute('aria-label', 'Chapters Menu');
  }

  /**
   * @name Create Menu
   * @description
   * Defined by videojs.MenuButton
   *
   * This method gets hit multiple times from multiple areas.
   * - constructor
   * - addtrack event
   * - removetrack event
   * - timeout hack
   */

  createMenu() {
    // need to initialize `this.items` because this gets called in a `super`
    // before this constructor gets called
    this.items = [];

    // NOTE: allow custom `ChapterThumbnailMenu`
    const Menu = videojs.getComponent('ChapterThumbnailMenu') || ChapterThumbnailMenu;

    const menu = new Menu(this.player(), {
      name: CHAPTER_THUMBNAIL_MENU_NAME,
    });

    const chapterTrack = this.findChaptersTrack();

    if (!chapterTrack) {
      return menu;
    }

    if (chapterTrack && chapterTrack.cues == null) {
      this.setTrack(chapterTrack);
    }

    // create menu if track cues are available
    if (chapterTrack && chapterTrack.cues && chapterTrack.cues.length > 0) {
      this.items = this.createItems(chapterTrack);

      for (let i = 0, length = this.items.length; i < length; i++) {
        // TODO: enables - onClick close menu
        // menu.addItem(this.items[i]);

        menu.addChild(this.items[i]);
      }

      if (this.items.length > 0) {
        this.show();
      }
    }

    return menu;
  }

  /**
   * @name Create Items
   * @description
   * Defined by videojs.MenuButton
   *
   */

  createItems(textTrack) {
    const items = [];

    if (!textTrack || textTrack.cues.length <= 0) {
      return items;
    }

    const {
      template,
    } = this.options_;

    // NOTE: allow custom `ChapterThumbnailMenuItem`
    const MenuItem = videojs.getComponent('ChapterThumbnailMenuItem') || ChapterThumbnailMenuItem;

    for (let i = 0, length = textTrack.cues.length; i < length; i++) {
      const cue = textTrack.cues[i];

      // This will be called repeatedly, so only try to set `cue.thumbnailData` if it hasn't been
      // set yet.
      if (textTrack.kind === 'metadata' && !cue.thumbnailData) {
        try {
          // Try to parse the text. This will throw if it isn't parseable, which means we don't want
          // to change it.
          JSON.parse(cue.text);

          // Add thumbnail info to the cue. This is non-standard, but so are chapter thumbnails.
          cue.thumbnailData = cue.text;

          // Remove the text so nothing is displayed on screen when the thumbnail is active
          cue.text = '';
        } catch (error) {
          // Filter out `SyntaxError`, throw on everything else.
          if (typeof error !== SyntaxError) {
            throw error;
          }
        }
      }

      items.push(new MenuItem(this.player(), {
        cue,
        template,
        textTrack,
      }));
    }

    return items;
  }

  findChaptersTrack() {
    const tracks = this.player().remoteTextTracks() || [];

    for (let i = 0, length = tracks.length; i < length; i++) {
      const track = tracks[i];

      if (track.id === TRACK_ID) {
        return track;
      }
    }

    return undefined;
  }

  setTrack(track) {
    if (!track) {
      return;
    }

    this.track = track;

    this.track.mode = 'hidden';

    const remoteTextTrackEl = this.player().remoteTextTrackEls().getTrackElementByTrack_(
      this.track
    );

    if (!remoteTextTrackEl) {
      return;
    }

    remoteTextTrackEl.addEventListener('load', () => this.update());
  }
}

ChapterThumbnailMenuButton.prototype.controlText_ = 'Chapters';

videojs.registerComponent('ChapterThumbnailMenuButton', ChapterThumbnailMenuButton);

export {
  CHAPTER_THUMBNAIL_MENU_BUTTON_NAME,
  ChapterThumbnailMenuButton,
};
