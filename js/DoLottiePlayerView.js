import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';
class DotLottiePlayerView extends Backbone.View {
  className() {
    return ['dotlottie', this.model.class].join(' ');
  }

  tagName() {
    return 'span';
  }

  initialize() {
    this.setUpListeners();
    this.render();
  }

  setUpListeners() {
    this.$el.on('onscreen', this.onScreenChange.bind(this));
  }

  onScreenChange(event, { onscreen, percentInview } = {}) {
    if (!this.player) return;
    const isOffScreen =
      !onscreen ||
      percentInview < (this.model.settings._onScreenPercentInviewVertical ?? 1);
    if (isOffScreen) return this.onOffScreen();
    this.onOnScreen();
  }

  onOffScreen() {
    this.player.pause();
  }

  onOnScreen() {
    if (this.model.settings.autoplay) this.player.play();
  }

  setupPlayer() {
    this.player = this.$el.find('dotlottie-player')[0];
    this.player.addEventListener('ready', this.onPlayerReady.bind(this));
  }

  onPlayerReady() {
    this.trigger('ready');
  }

  render() {
    ReactDOM.render(<templates.dotlottieplayer {...this.model} />, this.el);
    this.setupPlayer();
  }
}
export default DotLottiePlayerView;
