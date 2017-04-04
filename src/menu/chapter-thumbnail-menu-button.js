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
    let chapterTrack;
    let track;

    const tracks = this.player().remoteTextTracks() || [];

    // Cleanup to create new menu
    if (this.menu) {
      this.removeChild(this.menu);
      this.menu = null;
    }

    this.items = [];

    const Menu = videojs.getComponent('ChapterThumbnailMenu') || ChapterThumbnailMenu;

    this.menu = new Menu(this.player(), {
      name: CHAPTER_THUMBNAIL_MENU_NAME,
    });

    for (let i = 0, length = tracks.length; i < length; i++) {
      track = tracks[i];

      if (track.id === TRACK_ID) {
        chapterTrack = track;

        break;
      }
    }

    if (!chapterTrack) {
      return this.menu;
    }

    if (chapterTrack && chapterTrack.cues == null) {
      track.mode = 'hidden';

      const remoteTextTrackEl = this.player().remoteTextTrackEls().getTrackElementByTrack_(track);

      if (remoteTextTrackEl) {
        remoteTextTrackEl.addEventListener('load', () => this.createMenu());
      }
    }

    // create menu if track cues are available
    if (chapterTrack && chapterTrack.cues && chapterTrack.cues.length > 0) {
      this.items = this.createItems(chapterTrack);

      for (let i = 0, length = this.items.length; i < length; i++) {
        // TODO: enables - onClick close menu
        // menu.addItem(this.items[i]);

        this.menu.addChild(this.items[i]);
      }

      this.addChild(this.menu);

      if (this.items.length > 0) {
        this.show();
      }
    }

    return this.menu;
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

    const MenuItem = videojs.getComponent('ChapterThumbnailMenuItem') || ChapterThumbnailMenuItem;

    for (let i = 0, length = textTrack.cues.length; i < length; i++) {
      const cue = textTrack.cues[i];

      items.push(new MenuItem(this.player(), {
        cue,
        template,
        textTrack,
      }));
    }

    return items;
  }

  /**
   * @name Update
   * @description
   * Defined by videojs.MenuButton
   *
   * Must override so that the menu isn't attached to the videojs.MenuButton.
   * Instead we will manage it ourselves by adding it to the player directly.
   */

  update() {
    const menu = this.createMenu();

    this.menu = menu;

    this.buttonPressed_ = false;

    if (this.items && this.items.length === 0) {
      this.hide();
    } else if (this.items && this.items.length > 1) {
      this.show();
    }
  }
}

ChapterThumbnailMenuButton.prototype.controlText_ = 'Chapters';

videojs.registerComponent('ChapterThumbnailMenuButton', ChapterThumbnailMenuButton);

export {
  CHAPTER_THUMBNAIL_MENU_BUTTON_NAME,
  ChapterThumbnailMenuButton,
};
