/* global videojs */

import ChapterThumbnails from '../src/videojs-chapter-thumbnail';

import TRACK_ID from '../src/track/text-track';

describe('chapter-thumbnail.js', () => {
  let player;

  beforeEach(() => {
    // followed example — https://github.com/videojs/videojs-contrib-ads

    videojs.getComponent('Html5').isSupported = () => true;

    delete videojs.getComponent('Html5').prototype.setSource;

    const video = document.createElement('video');

    video.load = () => {};
    video.play = () => {};

    document.getElementById('video_fixture').innerHTML = video.outerHTML;

    player = videojs(video, {
      html5: {
        nativeTextTracks: false,
      },
    });
  });

  it('should initialize with defaults.', () => {
    const chapterThumbnail = new ChapterThumbnails(player);

    chapterThumbnail.addTextTrack();

    const track = player.textTracks().getTrackById(TRACK_ID);

    expect(track.id).toBe(TRACK_ID);
    expect(track.kind).toBe('metadata');
    expect(track.label).toBe('English');
    expect(track.language).toBe('en');
    expect(track.mode).toBe('hidden');
  });

  it('should initialize with options.', () => {
    const chapterThumbnail = new ChapterThumbnails(player, {
      label: 'French',
      language: 'fr',
    });

    chapterThumbnail.addTextTrack();

    const track = player.textTracks().getTrackById(TRACK_ID);

    expect(track.label).toBe('French');
    expect(track.language).toBe('fr');
  });

  it('should contain one textTrack', () => {
    expect(player.textTracks().length).toBe(0);

    const chapterThumbnail = new ChapterThumbnails(player);

    chapterThumbnail.addTextTrack();

    expect(player.textTracks().length).toBe(1);
  });

  // TODO: no idea how to do other tests…
});
