var TwinklGame = TwinklGame || {};

(function (tw) {

    tw.mixins = {

        goFontResize: {
            data: function () {
                return {
                    isFullscreen: false,
                    screenIsSmall: true,
                    fitTextTimeoutId: null
                }
            },
            mounted: function () {

                window.onresize = this.resizeHandler;

                tw.Utils.addFullscreenCallback(function () {
                    this.isFullscreen = !this.isFullscreen;
                    // tw.Utils.track('fullscreen', (scope.isFullscreen ? 1 : 0));
                    this.resizeHandler();
                }.bind(this));

                Vue.nextTick(function () {
                    this.resizeHandler.call(this);
                }.bind(this));

            },
            methods: {
                resizeHandler: function () {

                    var smallDisplay = true;

                    if(window.innerWidth >= 1184) smallDisplay = false; // old = 1200

                    if(this.isFullscreen) smallDisplay = true;

                    if(smallDisplay !== this.screenIsSmall) {
                        this.screenIsSmall = !this.screenIsSmall;
                        // if(this.screenIsSmall) {
                        //     tw.Utils.removeClass(this.$el, 'interactive-large');
                        // } else {
                        //     tw.Utils.addClass(this.$el, 'interactive-large');
                        // }
                    }

                    clearTimeout(this.fitTextTimeoutId);

                    Vue.nextTick(function () {

                        this.fitTextTimeoutId = setTimeout(function () {

                            this.fitTextTitle();
                            // any other common issues ?

                        }.bind(this), 200);

                    }.bind(this));

                },
                toggleFullscreen: function () {
                    if(this.isFullscreen) tw.Utils.makeFullScreen(document.getElementById('wrapper'));
                    else tw.Utils.leaveFullScreen();
                },
                fitTextTitle: function () {
                    tw.Utils.fitText($('.title-text'), 115);
                }
            }
        },

        getAsset: {
            methods: {
                getAssetUrl: function (key, fromObject) {
                    return tw.Utils.getAssetUrl(key, fromObject);
                },
                getConfigAssetUrl: function (assetObject) {
                    return tw.Utils.getConfigAssetUrl(assetObject);
                }
            }
        },

        capitalise: {
            methods: {
                capitalise: function (word) {
                    return tw.Utils.capitalise(word);
                }
            }
        },

        timer: {
            data: function () {
                return {
                    timerData: {
                        timerID: null,
                        timeLeft: 1,
                        lastTimestamp: 0,
                        paused: false
                    },
                    timeNumber: 1
                }
            },
            computed: {
                timeString: function () {
                    return tw.Utils.mmss(this.timeNumber);
                },
                // timeNumber: function () {
                //     return Math.ceil(this.timerData.timeLeft);
                // }
            },
            methods: {
                startTimer: function (seconds, finishedCallback, focusElement) {
                    seconds = seconds || 60;
                    finishedCallback = finishedCallback || tw.Utils.noOp;
                    this.timerData.timeLeft = seconds;
                    this.timeNumber = seconds;
                    this.timerData.lastTimestamp = seconds;
                    this.timerData.paused = false;
                    var scope = this;

                    if(tw.Utils.canAutofocus() && typeof focusElement !== 'undefined') {
                        Vue.nextTick(function () {
                            focusElement.focus();
                        });
                    }
                    scope.clearTimer();

                    scope.timerData.timerID = setInterval(function () {

                        if(!scope.timerData.paused) {
                            scope.timerData.timeLeft -= 0.02;
                            if((scope.timerData.timeLeft|0) + 1 !== scope.timeNumber) {
                                scope.timeNumber = (scope.timerData.timeLeft|0) + 1;
                            }
                        }

                        if(scope.timerData.timeLeft <= 0) {
                            scope.clearTimer();
                            if(typeof finishedCallback === 'function') finishedCallback();
                        }
                    }, 20);

                    // scope.timerData.timerID = requestAnimationFrame(function timerLoop (timestamp) {
                    //
                    //     if(!scope.timerData.paused) {
                    //         if(scope.timerData.lastTimestamp !== 0) scope.timerData.timeLeft -= ((timestamp - scope.timerData.lastTimestamp)/1000);
                    //
                    //         scope.timerData.lastTimestamp = timestamp;
                    //     }
                    //
                    //     if(scope.timerData.timeLeft <= 0) {
                    //         scope.clearTimer();
                    //         if(typeof finishedCallback === 'function') finishedCallback();
                    //         return;
                    //     }
                    //
                    //     requestAnimationFrame(timerLoop);
                    //
                    // });

                },
                clearTimer: function () {
                    this.resumeTimer();
                    if(this.timerData.timerID !== null) {
                        clearInterval(this.timerData.timerID);
                        //cancelAnimationFrame(this.timerData.timerID);
                    }
                },
                pauseTimer: function () {
                    this.setTimerPaused(true);
                },
                resumeTimer: function () {
                    this.setTimerPaused(false);
                },
                setTimerPaused: function (paused) {
                    this.timerData.paused = paused;
                },
                getTimerPaused: function () {
                    return this.timerData.paused;
                },
                getTimerTime: function () {
                    return this.timeNumber;
                },
                getTimerTimeFloat: function () {
                    return this.timerData.timeLeft;
                }
            }
        }
    }

})(TwinklGame);