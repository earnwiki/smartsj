/*!
 * Lazy Load - JavaScript plugin for lazy loading images
 *
 * Copyright (c) 2007-2019 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://appelsiini.net/projects/lazyload
 *
 * Version: 2.0.0-rc.2
 *
 */

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(root)
    } else if (typeof define === 'function' && define.amd) {
        define([], factory)
    } else {
        root.LazyLoad = factory(root)
    }
})(typeof global !== 'undefined' ? global : (this?.window ?? window) || (this?.global ?? global), function (root) {

    'use strict'

    if (typeof define === 'function' && define.amd) {
        root = window
    }

    const defaults = {
        src: 'data-src',
        srcset: 'data-srcset',
        lazyLoadClass: 'data-lazy-load-class',
        selector: '.lazyload',
        root: null,
        rootMargin: '0px',
        threshold: 0
    }

    /**
     * Merge two or more objects. Returns a new object.
     * @private
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    const extend = function () {

        let extended = {}
        let deep = false
        let i = 0
        let length = arguments.length

        /* Check if a deep merge */
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0]
            i++
        }

        /* Merge the object into the extended object */
        let merge = function (obj) {
            for (let prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    /* If deep merge and property is an object, merge properties */
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop])
                    } else {
                        extended[prop] = obj[prop]
                    }
                }
            }
        }

        /* Loop through each object and conduct a merge */
        for (; i < length; i++) {
            let obj = arguments[i]
            merge(obj)
        }

        return extended
    }

    function LazyLoad(images, options)
    {
        this.settings = extend(defaults, options || {})
        this.images = images || document.querySelectorAll(this.settings.selector)
        this.observer = null
        this.init()
    }

    LazyLoad.prototype = {
        init: function () {
            /* Without observers load everything and bail out early. */
            if (!root.IntersectionObserver) {
                this.loadImages()
                return
            }

            let self = this
            let observerConfig = {
                root: this.settings.root,
                rootMargin: this.settings.rootMargin,
                threshold: [this.settings.threshold]
            }

            this.observer = new IntersectionObserver(entries => {
                Array.prototype.forEach.call(entries, entry => {
                    if (entry.isIntersecting) {
                        self.observer.unobserve(entry.target);
                        let src = entry.target.getAttribute(self.settings.src)
                        let srcset = entry.target.getAttribute(self.settings.srcset)
                        let lazyLoadClass = entry.target.getAttribute(self.settings.lazyLoadClass)
                        if ('video' === entry.target.tagName.toLowerCase()) {
                            entry.target.autoplay = true;
                            entry.target.load();
                        } else if ('img' === entry.target.tagName.toLowerCase()) {
                            if (src) {
                                entry.target.src = src
                            }
                            if (srcset) {
                                entry.target.srcset = srcset
                            }
                        } else {
                            if (src) {
                                entry.target.style.backgroundImage = 'url(\'' + src + '\')'
                            } else if (srcset) {
                                const background = this.getBackgroundImageFromSrcset(srcset);
                                if (background) {
                                    entry.target.style.backgroundImage = 'url(\'' + background + '\')'
                                }
                            } else if (lazyLoadClass) {
                                let classesArray = lazyLoadClass.replaceAll('\n', '').split(' ').filter(el => el);
                                for (let className of classesArray) {
                                    entry.target.classList.add(className);
                                }
                            }
                        }
                    }
                })
            }, observerConfig)

            Array.prototype.forEach.call(this.images, function (image) {
                self.observer.observe(image)
            })
        },

        loadAndDestroy: function () {
            if (!this.settings) {
                return;
            }
            this.loadImages()
            this.destroy()
        },

        loadImages: function () {
            if (!this.settings) {
                return
            }

            let self = this
            Array.prototype.forEach.call(this.images, image => {
                let src = image.getAttribute(self.settings.src)
                let srcset = image.getAttribute(self.settings.srcset)
                if ('video' === image.tagName.toLowerCase()) {
                    image.autoplay = true;
                    image.load();
                } else if ('img' === image.tagName.toLowerCase()) {
                    if (src) {
                        image.src = src
                    }
                    if (srcset) {
                        image.srcset = srcset
                    }
                } else {
                    if (src) {
                        image.style.backgroundImage = 'url(\'' + src + '\')'
                    } else if (srcset) {
                        const background = this.getBackgroundImageFromSrcset(srcset);
                        if (background) {
                            image.style.backgroundImage = 'url(\'' + background + '\')'
                        }
                    }
                }
            })
        },

        destroy: function () {
            if (!this.settings) {
                return }
            this.observer.disconnect()
            this.settings = null
        },

        getBackgroundImageFromSrcset: function (srcset) {
            const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let asset;
            let lastBreakpoint = 0;
            Array.prototype.forEach.call(srcset.split(', '), (entry) => {
                const data = entry.split(' ');
                const breakPointWidth = parseFloat(data[1]);
                if (width >= breakPointWidth && lastBreakpoint <= breakPointWidth) {
                    asset = data[0];
                    lastBreakpoint = breakPointWidth;
                }
            });

            return asset;
        }
    }

    root.lazyload = function (images, options) {
        return new LazyLoad(images, options)
    }

    if (root.jQuery) {
        const $ = root.jQuery
        $.fn.lazyload = function (options) {
            options = options || {}
            options.attribute = options.attribute || 'data-src'
            new LazyLoad($.makeArray(this), options)
            return this
        }
    }

    return LazyLoad
})
