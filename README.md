# `track-list`

A Web Component for
enhancing a list of individual
audio tracks,
to provide playlist controls:

## Features

This Web Component allows you to:

- Only one track plays at a time
- When one track finishes, the next one plays
- Playlist play/pause button
- Buttons for previous/next track

**[Demo](https://mirisuzanne.github.io/track-list/demo.html)**

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/mirisuzanne/track-list?file=track-list.js&initialPath=/demo.html)

## Example

General usage example:

```html
<script type="module" src="track-list.js"></script>

<track-list>
  <ol slot="tracks">
    <li>
      <strong>Last Bullet</strong>
      <audio controls src="https://www.dropbox.com/scl/fi/p1z45eo48yh74vzpe85ka/Teacup-Gorilla-01-Last-Bullet.mp3?dl=1"></audio>
    </li>
    <li aria-current="true">
      <strong>Just Like That</strong>
      <audio controls src="https://www.dropbox.com/scl/fi/pnkcauncu9fzh2vbwq5tb/Teacup-Gorilla-02-Just-Like-That.mp3?dl=1"></audio>
    </li>
    <li>
      <strong>I'm Not Ready to Go (yet)</strong>
      <audio controls src="https://www.dropbox.com/scl/fi/9lgkpz6pzl8zfs8otujrv/Teacup-Gorilla-03-I-m-Not-Ready-To-Go-Yet.mp3?dl=1"></audio>
    </li>
    <li>
      <strong>Suicide Note</strong>
      <audio controls src="https://www.dropbox.com/scl/fi/w4hbwqg3727on3kb4z9lu/Teacup-Gorilla-04-Suicide-Note.mp3?dl=1"></audio>
    </li>
    <li>
      <strong>Pig Sez</strong>
      <em>(some words from C.A. Conrad)</em>
      <audio controls src="https://www.dropbox.com/scl/fi/95i61o8hg0818fh9lbk4n/Teacup-Gorilla-05-Pig-Sez.mp3?dl=1"></audio>
    </li>
  </ol>
</track-list>
```

Note that the track list
must be in the `tracks` slot,
and contain an `li` for each track.
This will fallback to a standard
list of tracks,
without any additional controls.

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@terriblemia/track-list): `npm install @terriblemia/track-list`
1. [Download the source manually from GitHub](https://github.com/mirisuzanne/track-list/releases) into your project.
1. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

## Usage

Make sure you include the `<script>` in your project (choose one of these):

```html
<!-- Host yourself -->
<script type="module" src="track-list.js"></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://www.unpkg.com/@terriblemia/track-list@1.0.0/track-list.js"
></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://esm.sh/@terriblemia/track-list@1.0.0"
></script>
```

Or use the built in
[WebC](https://www.11ty.dev/docs/languages/webc/) component
with [Eleventy](https://www.11ty.dev/docs/),
by adding `"npm:@terriblemia/track-list/*.webc"`
to the Eleventy WebC Plugin `components` registry:

```js
// Only one module.exports per configuration file, please!
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyWebcPlugin, {
    components: [
      // Add as a global WebC component
      "npm:@11ty/track-list/*.webc",
    ],
  });
}
```

### Style hooks

The currently-active track `li`
will always have `aria-current="true"`.
This is the first track by default,
but can be set explicitly in the HTML
to start on a different track.

There is a `menu` provided,
with two list items
and three buttons.
All are labeled as parts for styling:

- `track-list::part(menu)` - the `menu` wrapper
- `track-list::part(menu-item)` - each `li` in the `menu`
- `track-list::part(button)` - all of the menu `button`s
  - `track-list::part(disabled)` - disabled menu buttons
  - `track-list::part(icon)` - all menu button icons
  - `track-list::part(text)` - all menu button text
- `track-list::part(play)` - the _play/pause_ button
  - `track-list::part(play paused)` the play/pause button, when paused
  - `track-list::part(play-icon)` the play/pause icon
  - `track-list::part(play-text)` the play/pause button text
- `track-list::part(prev)` - the _previous track_ button
  - `track-list::part(prev disabled)` the previous-track button, when disabled
  - `track-list::part(prev-icon)` the previous-track icon
  - `track-list::part(prev-text)` the previous-track button text
- `track-list::part(next)` - the _next track_ button
  - `track-list::part(next disabled)` the next-track button, when disabled
  - `track-list::part(next-icon)` the next-track icon
  - `track-list::part(next-text)` the next-track button text

### Slots

There are two slots provided --
`tracks` and `menu`.
Content should be explicitly slotted
into one or the other.

Any slotted `menu` should provide
three buttons, with the following attributes:

- `track-part=play` - _play/pause_ button
  - currently requires nested `<btn-icon` and `<btn-text>` elements
- `track-part=prev` - _previous track_
- `track-part=next` - _next track_

## ToDo

- [ ] Test with custom audio controls
- [ ] Allow slotted menu buttons to have more flexibility
- [ ] Auto-slot `ol`/`ul` direct children?

## Support

At OddBird,
we enjoy collaborating and contributing
as part of an open web community.
But those contributions take time and effort.
If you're interested in supporting our
open-source work,
consider becoming a
[GitHub sponsor](https://github.com/sponsors/oddbird),
or contributing to our
[Open Collective](https://opencollective.com/oddbird-open-source).

❤️ Thanks!

## Credit

With thanks to the following people:

- [David Darnes](https://darn.es/) for the
  [Web Component repo template](https://github.com/daviddarnes/component-template)
