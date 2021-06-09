var TwinklGame = TwinklGame || {};

(function (tw) {

    Vue.component('go-icon', {
        props: {
            icon: {
                type: String,
                default: 'close'
            }
        },
        data: function () {
            return {}
        },
        methods: {},
        template:
            '<span class="font-button" :class="icon" v-on:click="$emit(\'click\', $event)"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></span>'
    });

    Vue.component('title-screen', {
        props: {
            title: '',
            subtitle: '',
            letsGoText: {
                default: "Let's go!",
                type: String
            },
            bgimage: {
                default: '',
                type: String
            },
            subtitleFilled: false,
            titleInverted: false,
            titleUndarkened: false,
            explore: false,
            logoColour: {
                default: 'White',
                type: String
            }
        },
        data: function () {
            return {}
        },
        methods: {
            letsgo: function () {
                this.$emit('letsgo');
            }
        },
        mounted: function () {

            var titleTextEl = $('#go-resource-title-screen .title-text');

            var fitTextCallback = function () {
                tw.Utils.fitText(titleTextEl, 120);
            };

            tw.Utils.addFullscreenCallback(fitTextCallback);

            window.addEventListener('resize', fitTextCallback);

            Vue.nextTick(function () {
                setTimeout(function () {
                    fitTextCallback();
                }, 200);
            });

        },
        template:   // TODO - logo backing
            '<div class="main-screen title-screen backgrounded cover" id="go-resource-title-screen" :style="{ backgroundImage: \'url(\' + bgimage + \')\' }" :class="{ \'explore\': explore }">\
                <div class="title-text no-select" :class="{ \'undarken\': titleUndarkened, \'inverted\': titleInverted }">{{ title }}</div>\
                <div class="title-subtext no-select" v-show="subtitle.length > 0" :class="( subtitleFilled ? \'theme-text\' : \'text-white\' )">{{ subtitle }}</div>\
                <div class="text-button lets-go" v-on:click="letsgo">{{ letsGoText }}</div>\
                <div class="title-logo-temp" :class="[ logoColour ]"></div>\
            </div>'
    });

    Vue.component('ingame-sidebar', {
        props: {
            hasMute: {
                type: Boolean,
                default: true
            },
            hasHelp: {
                type: Boolean,
                default: true
            },
            minimal: {
                type: Boolean,
                default: false
            },
            eyfs: {
                type: Boolean,
                default: false
            },
            coloursChange: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                fullscreen: false,
                muted: false,
                helping: false
            }
        },
        methods: {
            close: function () {
                this.$emit('close');
            },
            help: function () {
                this.helping = !this.helping;
                tw.Utils.track('help', (this.helping ? 1 : 0));
                this.$emit('help');
            },
            toggleFullscreen: function () {
                this.fullscreen = !this.fullscreen;
                this.$emit('fullscreen', this.fullscreen);
                if(this.fullscreen) tw.Utils.makeFullScreen();
                else tw.Utils.leaveFullScreen();
            },
            toggleMuted: function () {
                this.muted = !this.muted;
                if(window.Howler) Howler.mute(this.muted);
                if(window.createjs) createjs.Sound.muted = this.muted;
                this.$emit('mute', this.muted);
                tw.Utils.track(tw.Utils.eventNames.mute, (this.muted ? 1 : 0));
            }
        },
        template: '\
        <div class="go-navigation-bar" :class="{ \'minimal\': minimal, \'eyfs-layout\': eyfs }">\
            <div class="go-nav-panel" :class="{ \'theme-background-dark\': !eyfs && coloursChange }">\
                <div class="circle-buttons-container">\
                    <go-icon :icon="\'close\'" v-on:click="close" :class="{ \'inverted\': !minimal && !eyfs && coloursChange }" v-if="!eyfs"></go-icon>\
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 198 198" class="go-home-icon" v-if="eyfs" v-on:click="close"><g><g><circle class="theme-fill-dark" cx="99" cy="99" r="99"/><path fill="#ffffff" d="M156.32,96.05,107.81,47.54A11.64,11.64,0,0,0,99,44.14a11.64,11.64,0,0,0-8.81,3.4L41.68,96.05a11.71,11.71,0,0,0,16.57,16.56l.26-.26.39,38.37s-.45,3.16,2.7,3.16h23a1.77,1.77,0,0,0,1.8-1.81V119.63a2.42,2.42,0,0,1,2.26-2.25h20.72a2.42,2.42,0,0,1,2.26,2.25v32.44a1.77,1.77,0,0,0,1.8,1.81h23c3.15,0,2.7-3.16,2.7-3.16l.39-38.37.26.26a11.71,11.71,0,0,0,16.57,0h0A11.71,11.71,0,0,0,156.32,96.05Z"/></g></g></svg>\
                    <go-icon :icon="\'help\'" v-show="hasHelp" v-on:click="help" :class="{ \'inverted\': !minimal && !eyfs && coloursChange }"></go-icon>\
                    <slot></slot>\
                </div>\
                <div class="square-buttons-container">\
                    <slot name="square"></slot>\
                    <go-icon :icon="muted ? \'unmute\' : \'mute\'" v-show="hasMute" :class="{ \'inverted\': !minimal && !eyfs && coloursChange }" v-on:click="toggleMuted()"></go-icon>\
                    <go-icon :icon="fullscreen ? \'reduce-screen\' : \'expand-screen\'" :class="{ \'inverted\': !minimal && !eyfs && coloursChange }" v-on:click="toggleFullscreen()"></go-icon>\
                </div>\
            </div>\
        </div>\
        \
        '
    });

    Vue.component('ingame-sidebar-top', {
        props: {
            content: '',
            hasHelp: {
                default: true,
                type: Boolean
            },
            hasReset: false,
            frosty: {
                default: true,
                type: Boolean
            },
            explore: false
        },
        data: function () {
            return {
                helping: false
            }
        },
        methods: {
            close: function () {
                this.$emit('close');
            },
            help: function () {
                this.helping = !this.helping;
                tw.Utils.track('help', (this.helping ? 1 : 0));
                this.$emit('help');
            },
            reset: function () {

            }
        },
        computed: {

        },
        template:
            '<div class="ingame-sidebar top" :class="{\'frosty\': frosty}">\
                <div style="width: 99%">\
                    <div class="button-backing" v-show="explore"></div>\
                    <go-icon :icon="\'reset\'" v-on:click="reset" v-show="hasReset"></go-icon>\
                    <slot></slot>\
                    <div v-html="content"></div>\
                </div>\
            </div>'
    });

    Vue.component('ingame-sidebar-bottom', {
        props: {
            content: '',
            hasMute: {
                type: Boolean,
                default: true
            },
            fullscreenContainerSelector: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                fullscreenContainerRef: null,
                fullscreen: false,
                muted: false
            }
        },
        methods: {
            toggleFullscreen: function () {
                this.fullscreen = !this.fullscreen;
                this.$emit('fullscreen', this.fullscreen);
                if(this.fullscreen) {
                    var fsEl = this.$parent.$el ? this.$parent.$el : undefined;
                    if(this.fullscreenContainerRef !== null) fsEl = this.fullscreenContainerRef;
                    tw.Utils.makeFullScreen(fsEl);
                }
                else tw.Utils.leaveFullScreen();
            },
            toggleMuted: function () {
                this.muted = !this.muted;
                if(window.Howler) Howler.mute(this.muted);
                if(window.createjs) createjs.Sound.muted = this.muted;
                this.$emit('mute', this.muted);
            }
        },
        mounted: function () {
            if(this.fullscreenContainerSelector.length > 0)
                this.fullscreenContainerRef = document.querySelector(this.fullscreenContainerSelector);
        },
        template:
            '<div class="ingame-sidebar bottom">\
                <div class="button-container">\
                    <go-icon :icon="fullscreen ? \'reduce-screen\' : \'expand-screen\'" v-on:click="toggleFullscreen()"></go-icon>\
                    <go-icon :icon="muted ? \'unmute\' : \'mute\'" v-show="hasMute" v-on:click="toggleMuted()"></go-icon>\
                </div>\
                <slot></slot>\
                <div v-html="content"></div>\
            </div>'
    });

    Vue.component('frosty-stack', {
        props: {
            content: {
                type: Array,
                default: function () {
                    return ['Score | 0', '02:00', '<span class="font-button difficulty easy"><span class="path1"></span><span class="path2"></span></span>']
                }
            }
        },
        data: function () {
            return {}
        },
        methods: {

        },
        template:
            '<div class="main-screen frosty-stack no-select no-events">\
                <div v-for="item in content" class="frosty-stacker theme-colour" v-html="item" v-show="item.length > 0"></div>\
            </div>'
    });

    Vue.component('pause-menu', {
        props: {
            titleText: {
                type: String,
                default: 'Game paused'
            },
            resumeText: {
                type: String,
                default: 'Resume'
            },
            fullscreenText: {
                type: String,
                default: 'Fullscreen'
            },
            muteText: {
                type: String,
                default: 'Mute'
            },
            unmuteText: {
                type: String,
                default: 'Unmute'
            },
            closeText: {
                type: String,
                default: 'Quit game'
            },
            hasVolume: {
                type: Boolean,
                default: true
            },
            hasFullscreen: {
                type: Boolean,
                default: true
            },
            backgroundUrl: {
                type: String,
                default: ''
            },
            autoPause: {
                type: Boolean,
                default: false
            },
            noEvents: {
                type: Boolean,
                default: true
            },
            options: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data: function () {
            return {
                paused: false,
                muted: false,
                fullscreen: false,
                idleTime: 0
            }
        },
        methods: {
            dipVolume: function () {
                if(window.Howler) Howler.volume(this.paused ? 0.5 : 1.0);
                if(window.Tone) Tone.Master.volume.value = this.paused ? -6 : 0;
            },
            togglePause: function () {
                this.paused = !this.paused;
                this.dipVolume();
                // dim elements outside ?
                this.$emit('pause', this.paused);
            },
            toggleMute: function () {
                this.muted = !this.muted;
                if(window.Howler) Howler.mute(this.muted);
                if(window.Tone) Tone.Master.mute = this.muted;
                if(window.createjs) createjs.Sound.muted = this.muted;
                this.$emit('mute', this.muted);
            },
            toggleFullscreen: function () {
                this.fullscreen = !this.fullscreen;
                this.$emit('fullscreen', this.fullscreen);
                if(this.fullscreen) tw.Utils.makeFullScreen();
                else tw.Utils.leaveFullScreen();
            },
            close: function () {
                this.paused = false;
                this.dipVolume();
                this.$emit('close');
                tw.Utils.track('close');
            }
        },
        mounted: function () {
            // auto pause on tab change
            document.addEventListener('visibilitychange', function () {
                if(document.hidden && !this.paused && this.autoPause) this.togglePause();
            }.bind(this));
            // set up pause timer if left 5 min
            setInterval(function () {
                this.idleTime++;
                if(this.idleTime >= (5 * 60) && !this.paused && this.autoPause) this.togglePause();
            }.bind(this), 1000);
            var resetIdleTime = function () { this.idleTime = 0 }.bind(this);
            document.addEventListener('mousedown', resetIdleTime);
            document.addEventListener('keydown', resetIdleTime);
            document.addEventListener('touchstart', resetIdleTime);
        },
        template:
            '<div class="main-screen pause-menu-container" :class="{ \'no-events\': noEvents }">\
                <go-icon :icon="paused ? \'play\' : \'pause\'" v-on:click="togglePause"></go-icon>\
                <div class="pause-menu backgrounded" v-show="paused" :style="{ \'background-image\': \'url(\' + backgroundUrl + \')\' }" :class="{ \'pause-menu-custom-back\': backgroundUrl.length > 0 }">\
                    <div class="pause-menu-title theme-colour-dark no-select">{{ titleText }}</div>\
                    <div class="text-button" v-on:click="togglePause">\
                        <span class="pause-icon"><go-icon :icon="\'play\'"></go-icon></span>\
                        <span class="pause-text-area flex-vert-center"><span class="pause-text">{{ resumeText }}</span></span>\
                    </div>\
                    <div class="text-button" v-on:click="toggleMute" v-if="hasVolume">\
                        <span class="pause-icon"><go-icon :icon="muted ? \'unmute\' : \'mute\'"></go-icon></span>\
                        <span class="pause-text-area flex-vert-center"><span class="pause-text">{{ muted ? unmuteText : muteText }}</span></span>\
                    </div>\
                    <div class="text-button" v-on:click="toggleFullscreen" v-if="hasFullscreen">\
                        <span class="pause-icon"><go-icon :icon="\'expand-screen\'"></go-icon></span>\
                        <span class="pause-text-area flex-vert-center"><span class="pause-text">{{ fullscreenText }}</span></span>\
                    </div>\
                    <div class="text-button" v-for="option in options" v-on:click="option.handler">\
                        <span class="pause-icon"><go-icon :icon="option.icon"></go-icon></span>\
                        <span class="pause-text-area flex-vert-center"><span class="pause-text">{{ option.text }}</span></span>\
                    </div>\
                    <div class="text-button" v-on:click="close">\
                        <span class="pause-icon"><go-icon :icon="\'close\'"></go-icon></span>\
                        <span class="pause-text-area flex-vert-center"><span class="pause-text">{{ closeText }}</span></span>\
                    </div>\
                </div>\
                <slot name="extra"></slot>\
            </div>'
    });

    Vue.component('jodal', {
        props: {
            visible: {
                default: false,
                type: Boolean
            },
            title: {
                default: 'How to play:',
                type: String
            },
            content: {
                default: '',
                type: String
            },
            playable: {
                default: true,
                type: Boolean
            },
            closeable: false,
            differentiated: false,
            buttontext: {
                default: 'Play',
                type: String
            },
            backgroundUrl: {
                default: '',
                type: String
            }
        },
        data: function () {
            return {}
        },
        methods: {
            selectDifficulty: function (difficulty) {
                this.$emit('difficulty', difficulty);
            },
            play: function () {
                this.$emit('play');
            },
            close: function () {
                this.$emit('close');
            }
        },
        template:
            '<transition name="jodal">\
                <div class="jodal" v-show="visible">\
                    <div class="jodal-back backgrounded" :style="{ \'background-image\': \'url(\' + backgroundUrl + \')\' }" :class="{ \'jodal-custom-back\': backgroundUrl.length > 0 }"></div>\
                    <go-icon :icon="\'close\'" v-on:click="close" v-show="closeable"></go-icon>\
                    <div class="jodal-title">{{ title }}</div>\
                    <slot><span class="jodal-text">Can you solve the puzzle of Fibonacci\'s very unusual clock?</span></slot>\
                    <div v-if="differentiated" style="z-index: 82;">\
                        <go-icon :icon="\'difficulty easy\'" v-show="differentiated" v-on:click="selectDifficulty(\'easy\')"></go-icon>\
                        <go-icon :icon="\'difficulty medium\'" v-show="differentiated" v-on:click="selectDifficulty(\'medium\')"></go-icon>\
                        <go-icon :icon="\'difficulty hard\'" v-show="differentiated" v-on:click="selectDifficulty(\'hard\')"></go-icon>\
                    </div>\
                    <div class="text-button jodal-main-button" v-show="!differentiated && playable" v-on:click="play">{{ buttontext }}</div>\
                </div>\
            </transition>'
    });

    Vue.component('ipad-keypad', {
        props: {
            calculatorlayout: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                value: '',
                visible: true,
                larr: '&larr;'
            }
        },
        methods: {
            toggleHidden: function () {
                this.visible = !this.visible;
            },
            press: function (e) {
                if(e.target.tagName === 'INPUT') {
                    switch(e.target.value) {
                        case '<':
                            this.$emit('keypad-backspace');
                            this.value = this.value.slice(0, this.value.length - 1);
                            break;
                        case 'Enter':
                            this.$emit('keypad-enter', this.value);
                            break;
                        default:
                            this.$emit('keypad-number', Number(e.target.value));
                            this.value += Number(e.target.value);
                            break;
                    }
                }
            }
        },
        template:
            '<div v-show="visible" class="ipad-keypad" v-on:click="press">\
                <input class="keypad-btn theme-background" type="button" v-bind:value="calculatorlayout ? \'7\' : \'1\'">\
                <input class="keypad-btn theme-background" type="button" v-bind:value="calculatorlayout ? \'8\' : \'2\'" />\
                <input class="keypad-btn theme-background" type="button" v-bind:value="calculatorlayout ? \'9\' : \'3\'" /><br/>\
                <input class="keypad-btn theme-background" type="button" value="4" />\
                <input class="keypad-btn theme-background" type="button" value="5" />\
                <input class="keypad-btn theme-background" type="button" value="6" /><br/>\
                <input class="keypad-btn theme-background" type="button" v-bind:value="calculatorlayout ? \'1\' : \'7\'" />\
                <input class="keypad-btn theme-background" type="button" v-bind:value="calculatorlayout ? \'2\' : \'8\'" />\
                <input class="keypad-btn theme-background" type="button" v-bind:value="calculatorlayout ? \'3\' : \'9\'" /><br/>\
                <input class="keypad-btn backspace theme-background" alt="<" type="image" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00MTMuNDQyIDMzMi4zMDdhOC4wMDcgOC4wMDcgMCAwIDEgMi4zNzIgNS43MSA3Ljk4NCA3Ljk4NCAwIDAgMS0yLjM3MiA1LjcwN2wtMjEuODIzIDIxLjkwNWE3Ljk3MyA3Ljk3MyAwIDAgMS01LjY5MSAyLjM3MWMtMi4wNzEgMC00LjEzOC0uNzg1LTUuNjk1LTIuMzcxbC03Ni4yMy03Ni40NjEtNzYuMjMgNzYuNDYxYTcuOTQ3IDcuOTQ3IDAgMCAxLTUuNjk1IDIuMzcxIDcuOTc1IDcuOTc1IDAgMCAxLTUuNjkyLTIuMzcxbC0yMS44MjQtMjEuOTA1YTcuOTkgNy45OSAwIDAgMS0yLjM3My01LjcwN2MwLTIuMTQ4Ljg0Ni00LjIgMi4zNzMtNS43MUwyNzEuMDk4IDI1NmwtNzYuNzM4LTc2LjI5N2MtMy4xNDYtMy4xNTMtMy4xNDYtOC4yNzMgMC0xMS40MjdsMjEuODA3LTIxLjkxOWE4LjA0OCA4LjA0OCAwIDAgMSA1LjY5Ni0yLjM1N2MyLjE1MiAwIDQuMTg5Ljg0NyA1LjY5MSAyLjM1N2w3Ni40NDggNzUuNTMzIDc2LjQ0Ny03NS41MzNhOC4wMDYgOC4wMDYgMCAwIDEgNS42OTMtMi4zNTdjMi4xNDMgMCA0LjE3OS44NDcgNS42OTUgMi4zNTdsMjEuODA3IDIxLjkxOWMzLjE0NiAzLjE1MyAzLjE0NiA4LjI3MyAwIDExLjQyN0wzMzYuOTA0IDI1Nmw3Ni41MzggNzYuMzA3eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik00OTguOTQxIDkzLjU1OUM0OTAuMDM3IDg0LjY1NCA0NzguNjk2IDgwIDQ2NS44NzUgODBIMTY4Yy0yNC4zMDMgMC00My43MTcgOS40MDItNTcuNzA2IDI4LjQ0MUwwIDI1NS45MzhsMTEwLjQgMTQ2LjUyOC4xOC4yMzEuMTg0LjIzMmM2LjkwNCA4Ljg1NSAxNC40MjQgMTUuNzAxIDIyLjk5IDIwLjQxN0MxNDMuODgzIDQyOC45MjQgMTU1LjQwNSA0MzIgMTY4IDQzMmgyOThjMjYuMTkxIDAgNDYtMjIuMjU3IDQ2LTQ5VjEyN2MwLTEyLjgyMS00LjE1NC0yNC41MzctMTMuMDU5LTMzLjQ0MXpNNDgwIDM4M2MwIDguODM3LTUuMTYzIDE3LTE0IDE3SDE2OGMtMTUuMTY3IDAtMjQuMzMzLTYuNjY2LTMyLTE2LjVMNDAgMjU2bDk2LTEyOC40MzhjOS41LTEzIDIxLjE2Ny0xNS41NjIgMzItMTUuNTYyaDI5Ny41YzguODM3IDAgMTQuNSA2LjE2MyAxNC41IDE1djI1NnoiLz48L3N2Zz4=" value="<" title="Backspace" />\
                <input class="keypad-btn theme-background" type="button" value="0" />\
                <input class="keypad-btn enter theme-background" type="button" value="Enter" title="Enter" />\
            </div>'
    });

    Vue.component('play-audio-button', {
        props: ['src'],
        data: function () {
            return {
                playing: false,
                sound: {}
            }
        },
        methods: {
            playSound: function () {

                if(!this.playing) this.$emit('play');
                else this.$emit('stop');

                if(this.src && window.Howl) {
                    if(!this.playing) {
                        this.sound = new Howl({
                            src: [this.src],
                            autoplay: true
                        });

                        this.sound.on('end', function () {
                            this.sound.unload();
                            this.playing = false;
                        }.bind(this));

                        this.playing = true;
                    }
                    else {
                        this.sound.stop();
                        this.playing = false;
                    }
                }
            }
        },
        template:
            '<div class="text-button play-sound flex-vert-center" v-on:click="playSound">\
                <span class="play-sound-inner">\
                    <span class="flex-vert-center">Click to listen.</span>\
                    <img src="data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQ0cHgiIGhlaWdodD0iNDRweCIgdmlld0JveD0iMCAwIDQ0IDQ0Ij4KPGRlZnM+CjxnIGlkPSJMYXllcjBfMF9NRU1CRVJfMF9GSUxMIj4KPHBhdGggZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSJub25lIiBkPSIKTSAzNCAxNwpRIDM0IDEwIDI5IDUgMjQgMCAxNyAwIDkuOTUgMCA1IDUgMCAxMCAwIDE3IDAgMjQuMDUgNSAyOS4wNSA5Ljk1IDM0IDE3IDM0IDI0IDM0IDI5IDI5LjA1IDM0IDI0LjA1IDM0IDE3Ck0gMjYuOSA3LjEKUSAzMSAxMS4yNSAzMSAxNyAzMSAyMi44IDI2LjkgMjYuOSAyMi44IDMxIDE3IDMxIDExLjIgMzEgNy4xIDI2LjkgMyAyMi44IDMgMTcgMyAxMS4yIDcuMSA3LjEgMTEuMiAzIDE3IDMgMjIuOCAzIDI2LjkgNy4xIFoiLz4KPC9nPgoKPGcgaWQ9IkxheWVyMF8wX01FTUJFUl8xX0ZJTEwiPgo8cGF0aCBmaWxsPSIjRkZGRkZGIiBzdHJva2U9Im5vbmUiIGQ9IgpNIDI2LjA1IDE3ClEgMjYuMTUgMTYuMyAyNS40IDE1LjkKTCAxMy4zIDkuMQpRIDEyLjk1IDguOSAxMi42NSA4LjkgMTIuMTUgOC45IDExLjcgOS4yNSAxMS4zIDkuNjUgMTEuMyAxMC4yCkwgMTEuMyAyMy44NQpRIDExLjMgMjQuNDUgMTEuNyAyNC43NSAxMi4xIDI1LjE1IDEyLjY1IDI1LjE1IDEyLjggMjUuMTUgMTMuMyAyNC45NQpMIDI1LjQgMTguMTUKUSAyNi4xNSAxNy43NSAyNi4wNSAxNyBaIi8+CjwvZz4KPC9kZWZzPgoKPGcgdHJhbnNmb3JtPSJtYXRyaXgoIDEuMjU3MzI0MjE4NzUsIDAsIDAsIDEuMjU3MzI0MjE4NzUsIDAuNzUsMC41KSAiPgo8dXNlIHhsaW5rOmhyZWY9IiNMYXllcjBfMF9NRU1CRVJfMF9GSUxMIi8+CjwvZz4KCjxnIHRyYW5zZm9ybT0ibWF0cml4KCAxLjI1NzMyNDIxODc1LCAwLCAwLCAxLjI1NzMyNDIxODc1LCAwLjc1LDAuNSkgIj4KPHVzZSB4bGluazpocmVmPSIjTGF5ZXIwXzBfTUVNQkVSXzFfRklMTCIvPgo8L2c+Cjwvc3ZnPgo=" alt="play">\
                </span>\
            </div>'
    });

    Vue.component('go-burn', {
        props: [],
        template:
            '<div class="go-burn-container">\
                <img id="go-burn" src="/assets/svg/logo/Twinkl-Burn.svg">\
            </div>'
    });

    Vue.component('preloader', {
        props: {
            preloaded: {
                default: false,
                type: Boolean
            }
        },
        data: function () {
            return {
                // preloaded: false
            }
        },
        template:
            '<div id="preload-div" v-bind:class="{ loading: !preloaded }">\
                <span style="display: inline-block; height: 100%; vertical-align: middle;"></span>\
                <img src="/assets/twinkl_preloader.gif" style="vertical-align: middle; max-height: 100%">\
            </div>',
        // mounted: function () {
        //     this.preloaded = true;
        // }
    });

    var comp = Vue.component('interactive-resource', {
        data: function () {
            return {
                stage: 'title'
            }
        },
        template: '<div v-show="stage === \'title\'"></div><div v-show="stage === \'main\'"></div>'
    });

// console.log(comp);

// how to handle variable number of pages, each containing diff content ? some will be constant eg title + result screen, but rest will be diff

})(TwinklGame);
