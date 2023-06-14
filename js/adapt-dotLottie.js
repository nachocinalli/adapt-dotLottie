import Adapt from 'core/js/adapt';
import documentModifications from 'core/js/DOMElementModifications';
import 'libraries/dotlottie-player';
import DotLottiePlayerView from './DoLottiePlayerView';
class DotLottie extends Backbone.Controller {
  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.onDataReady);
  }

  onDataReady() {
    if (!this.checkCourseIsEnabled()) return;
    this.config = Adapt.course.get('_dotLottie');
    this.setupEventListeners();
  }

  setupEventListeners() {
    _.bindAll(this, 'onImgAdded', 'onImgRemoved', 'onDotLottieAdded');

    documentModifications.on('added:img', this.onImgAdded);
    documentModifications.on('removed:img', this.onImgRemoved);
    documentModifications.on('added:dotlottie', this.onDotLottieAdded);
  }

  onDotLottieAdded(event) {
    const dotLottie = event.target;
    const name = dotLottie.getAttribute('name');
    const src =
      this.config?._items?.find?.((item) => item._name === name)._src || '';
    const settings =
      this.config?._items?.find?.((item) => item._name === name)._settings ||
      '';
    const props = {
      src,
      class: name,
      settings
    };
    this.addLottiePlayer(props, dotLottie, false);
  }

  onImgAdded(event) {
    if (!this.isLottieGrahpic(event.target.src)) return;

    const img = event.target;
    const props = {
      ...[...img.attributes].reduce(
        (attrs, { name, value }) => ({ ...{ [name]: value }, ...attrs }),
        {}
      ),
      settings: this.config._settings,
      class: img.className
    };

    this.addLottiePlayer(props, img, true);
  }

  onImgRemoved(event) {
    if (!this.isLottieGrahpic(event.target.src)) return;
    const dotLottie = event.target.parentNode.querySelector('.dotlottie');
    if (dotLottie) dotLottie.remove();
  }

  addLottiePlayer(props, el, isGraphic) {
    const lottieView = new DotLottiePlayerView({ model: props });
    if (isGraphic) {
      el.src = this.config._imageSrc;
      el.after(lottieView.el);
    } else {
      el.replaceWith(lottieView.el);
    }
    lottieView.on('ready', () => {
      el.style.display = isGraphic ? 'none' : 'block';
    });
  }

  isLottieGrahpic(src) {
    return src.endsWith(this.config._fileExtension);
  }

  checkCourseIsEnabled() {
    const dotLottieModel = Adapt.course.get('_dotLottie');
    if (!dotLottieModel || !dotLottieModel._isEnabled) return false;
    return true;
  }
}

export default new DotLottie();
