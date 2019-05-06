<template>
  <div>
    <slot>
    </slot>
  </div>
</template>

<script>
import { tns } from 'tiny-slider/src/tiny-slider'
import 'tiny-slider/dist/tiny-slider.css'

export default {
  props: {
    mode: [String],
    axis: {
      type: [String],
      default: 'horizontal'
    },
    items: {
      type: [String, Number],
      default: 1
    },
    gutter: {
      type: [String, Number],
      default: 0
    },
    edgePadding: {
      type: [String, Number],
      default: 0
    },
    fixedWidth: {
      type: [String, Boolean, Number],
      default: false
    },
    slideBy: {
      type: [String, Number],
      default: 1
    },
    controls: {
      type: [String, Boolean],
      default: true
    },
    controlsText: {
      type: [Array],
      default: () => ['prev', 'next']
    },
    controlsContainer: {
      type: [Boolean, Node],
      default: false
    },
    nav: {
      type: [Boolean],
      default: false
    },
    navContainer: {
      type: [Boolean, Node],
      default: false
    },
    arrowKeys: {
      type: [Boolean],
      default: false
    },
    speed: {
      type: [String, Number],
      default: 300
    },
    autoplay: {
      type: [Boolean],
      default: false
    },
    autoplayTimeout: {
      type: [Number],
      default: 5000
    },
    autoplayDirection: {
      type: [String],
      default: 'forward'
    },
    autoplayText: {
      type: [Array],
      default: () => ['start', 'stop']
    },
    autoplayHoverPause: {
      type: [Boolean],
      default: false
    },
    autoplayButton: {
      type: [Boolean, Node, String],
      default: false
    },
    autoplayButtonOutput: {
      type: [Boolean],
      default: true
    },
    autoplayResetOnVisibility: {
      type: [Boolean],
      default: true
    },
    animateIn: {
      type: [String],
      default: 'tns-fadeIn'
    },
    animateOut: {
      type: [String],
      default: 'tns-fadeOut'
    },
    animateNormal: {
      type: [String],
      default: 'tns-normal'
    },
    animateDelay: {
      type: [String, Number, Boolean],
      default: false
    },
    loop: {
      type: [Boolean],
      default: true
    },
    rewind: {
      type: [Boolean],
      default: false
    },
    autoHeight: {
      type: [Boolean],
      default: false
    },
    responsive: {
      type: [Boolean, Object],
      default: false
    },
    lazyload: {
      type: [Boolean],
      default: false
    },
    touch: {
      type: [Boolean],
      default: true
    },
    mouseDrag: {
      type: [Boolean],
      default: false
    },
    nested: {
      type: [String, Boolean],
      default: false
    },
    freezable: {
      type: [Boolean],
      default: true
    },
    disable: {
      type: [Boolean],
      default: false
    },
    onInit: {
      type: [Function, Boolean],
      default: false
    }
  },
  mounted () {
    const that = this
    let settings = {
      container: that.$el,
      items: that.items,
      mode: that.mode,
      axis: that.axis,
      gutter: that.gutter,
      edgePadding: that.edgePadding,
      fixedWidth: that.fixedWidth,
      slideBy: that.slideBy,
      controls: that.controls,
      controlsText: that.controlsText,
      controlsContainer: that.controlsContainer,
      nav: that.nav,
      navContainer: that.navContainer,
      arrowKeys: that.arrowKeys,
      speed: that.speed,
      autoplay: that.autoplay,
      autoplayTimeout: that.autoplayTimeout,
      autoplayDirection: that.autoplayDirection,
      autoplayText: that.autoplayText,
      autoplayHoverPause: that.autoplayHoverPause,
      autoplayButton: that.autoplayButton,
      autoplayButtonOutput: that.autoplayButtonOutput,
      autoplayResetOnVisibility: that.autoplayResetOnVisibility,
      animateIn: that.animateIn,
      animateOut: that.animateOut,
      animateNormal: that.animateNormal,
      animateDelay: that.animateDelay,
      loop: that.loop,
      rewind: that.rewind,
      autoHeight: that.autoHeight,
      responsive: that.responsive,
      lazyload: that.lazyload,
      touch: that.touch,
      mouseDrag: that.mouseDrag,
      nested: that.nested,
      freezable: that.freezable,
      disable: that.disable,
      onInit: that.onInit
    }
    that.removeUndefinedProps(settings)
    that.slider = tns(settings)
  },
  methods: {
    removeUndefinedProps (obj) {
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop) && obj[prop] === undefined) {
          delete obj[prop]
        } else {
          console.log(obj[prop], prop)
        }
      }
    },
    goTo (value) {
      this.slider.goTo(value)
    },
    getInfo () {
      this.$emit('getInfo', this.slider.getInfo(), this.slider)
    },
    destroy () {
      this.slider.destroy()
    }
  }
}
</script>
