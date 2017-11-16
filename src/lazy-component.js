import { inBrowser } from './util'

export default (lazy) => {
    return {
        props: {
            tag: {
                type: String,
                default: 'div'
            },
            options: {
                type: Object,
                default: () => {}
            }
        },
        render (h) {
            if (this.show === false && !this.lazyOptions.lazyComponentOptions.prerender) {
                return h(this.tag)
            }
            return h(this.tag, {style: {
                visibility: this.show ? 'visible' : 'hidden'
            }}, this.$slots.default)
        },
        data () {
            return {
                el: null,
                state: {
                    loaded: false
                },
                rect: {},
                show: false,
                lazyOptions: Object.assign({}, lazy.options, this.options)
            }
        },
        mounted () {
            this.el = this.$el
            lazy.addLazyBox(this)
            lazy.lazyLoadHandler()
        },
        beforeDestroy () {
            lazy.removeComponent(this)
        },
        methods: {
            getRect () {
                this.rect = this.$el.getBoundingClientRect()
            },
            checkInView () {
                this.getRect()
                return inBrowser &&
                    (this.rect.top < window.innerHeight * this.lazyOptions.preLoad && this.rect.bottom > 0) &&
                    (this.rect.left < window.innerWidth * this.lazyOptions.preLoad && this.rect.right > 0)
            },
            load () {
                this.show = true
                this.state.loaded = true
                this.$emit('show', this)
            }
        }
    }
}
