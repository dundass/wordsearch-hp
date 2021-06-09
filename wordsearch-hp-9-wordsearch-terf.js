var TwinklGame = TwinklGame || {};

(function (tw) {

    var createWordsearch = function (manifest, config) {

        var sounds = {
            'click': new Howl({src: [manifest.click.src]}),
            'swoosh': new Howl({src: [manifest.swoosh.src]}),
            'levelup': new Howl({src: [manifest.levelup.src], volume: 0.7}),
            'wrong': new Howl({src: [manifest.incorrect_sound.src]})
        };

        return new Vue({
            el: '#wrapper',
            mixins: [tw.mixins.goFontResize, tw.mixins.getAsset],
            data: Object.assign({}, {

                manifest: manifest,
                stage: 'title',
                difficulty: 'easy',
                fullScreen: false,
                helping: false,
                grid: [],
                // words: [],
                word_lists: [], // to make the 'referenced during render' error shut the f up
                word_list_slice: [],
                unplacedStripped: [],
                unplaced: [],
                numComplete: 0,
                mousePressed: false,
                touchPressed: false,
                start: {},
                startX: -1,
                startY: -1,
                end: {},
                endX: -1,
                endY: -1,
                linesDrawn: [],

            }, config),
            methods: {
                letsgo: function () {
                    this.stage = 'instructions';
                    sounds['swoosh'].play();
                },
                onPlay: function () {
                    // route to either toMainScreen or to word list choice
                    if(this.isMultiList()) {

                        // send to word list choice view
                        this.stage = 'multi-list';

                    }
                    else {

                        // continue straight to main screen
                        this.toMainScreen(this.word_list);

                    }
                },
                toMainScreen: function (word_list) {
                    var scope = this;

                    this.stage = 'main';
                    this.numComplete = 0;
                    this.linesDrawn = [];

                    var targets = Array.prototype.slice.call(document.querySelector('.word-list').getElementsByTagName('div'));
                    for(var i = 0; i < targets.length; i++) {
                        if(TwinklGame.Utils.hasClass(targets[i], 'checked')) TwinklGame.Utils.removeClass(targets[i], 'checked');
                    }

                    tw.Utils.shuffleArray(word_list);
                    this.word_list_slice = word_list.slice(0, 12);

                    this.unplaced = [];
                    this.unplacedStripped = [];
                    var numWordsMissed = 200,
                        bestGrid = [],
                        unplaced = [];
                    for(var i = 0; i < 10; i++) {
                        var ws = wordsearch(this.wordsStripped, parseInt(this.grid_size), parseInt(this.grid_size), {backwards: 0});
                        if(ws.unplaced.length < numWordsMissed) {
                            numWordsMissed = ws.unplaced.length;
                            bestGrid = ws.grid;
                            unplaced = ws.unplaced;
                        }
                    }

                    //if(unplaced.length > 0) console.log('couldnt place ', unplaced.join(' '));

                    this.unplacedStripped = unplaced;
                    this.unplaced = unplaced.map(function (wordStripped) {
                        return scope.getWordForStripped(wordStripped);
                    });

                    this.grid = bestGrid;

                    Vue.nextTick(function () {
                        var cellDimension = 100 / parseInt(this.grid_size);
                        $('.wordsearch-row').css('height', cellDimension.toFixed(2) + '%');
                        var cells = $('.wordsearch-cell');
                        cells.css('width', cellDimension.toFixed(2) + '%');
                        tw.Utils.fitText(cells, 40);
                    }.bind(this))
                },
                mouseDown: function (e) {

                    if(this.touchPressed) return;

                    e.preventDefault();

                    var element = null;

                    if(e.changedTouches) {
                        element = e.changedTouches[0].target;
                        this.touchPressed = true;
                    }
                    else {
                        element = e.target;
                    }

                    if(element.tagName === 'SPAN' || element.tagName === 'span') {

                        var container = document.getElementsByClassName('create-activity-inner')[0];
                        var wordsearchSize = this.getBoundingClientRect(container);
                        var rect = this.getBoundingClientRect(element);
                        this.start.x = rect.x;
                        this.start.y = rect.y;
                        this.start.element = element;

                        this.startX = Number(element.getAttribute('data-x'));
                        this.startY = Number(element.getAttribute('data-y'));

                        this.mousePressed = true;

                        this.linesDrawn.push({
                            x1: (((this.start.x - wordsearchSize.x + rect.width / 2) / wordsearchSize.width) * 100).toFixed(2) + '%',
                            y1: (((this.start.y - wordsearchSize.y + rect.height / 2) / wordsearchSize.height) * 100).toFixed(2) + '%',
                            x2: (((this.start.x - wordsearchSize.x + rect.width / 2) / wordsearchSize.width) * 100).toFixed(2) + '%',
                            y2: (((this.start.y - wordsearchSize.y + rect.height / 2) / wordsearchSize.height) * 100).toFixed(2) + '%'
                        });
                    }
                },
                mouseMove: function (e) {

                    e.preventDefault();

                    var element = null;

                    if(e.changedTouches) {
                        element = document.elementFromPoint(e.changedTouches[0].pageX - window.scrollX, e.changedTouches[0].pageY - window.scrollY);
                    }
                    else {
                        element = e.target;
                    }

                    if(this.mousePressed && element.tagName === 'SPAN' || element.tagName === 'span') {

                        if(element !== this.start.element) {

                            // console.log('made it here -> ' + e.target.innerHTML)

                            var container = document.getElementsByClassName('create-activity-container')[0];
                            var wordsearchSize = this.getBoundingClientRect(container);

                            var targetRect = this.getBoundingClientRect(element);
                            // document.title = targetRect.width;

                            this.linesDrawn[this.linesDrawn.length - 1].x2 = (((targetRect.x - wordsearchSize.x + targetRect.width / 2) / wordsearchSize.width) * 100).toFixed(2) + '%';
                            this.linesDrawn[this.linesDrawn.length - 1].y2 = (((targetRect.y - wordsearchSize.y + targetRect.height / 2) / wordsearchSize.height) * 100).toFixed(2) + '%';
                            // this.linesDrawn[this.linesDrawn.length - 1] = Object.assign({}, this.linesDrawn[this.linesDrawn.length - 1]);
                            // this.linesDrawn = Object.assign([], this.linesDrawn);
                        }
                    }
                },
                mouseUp: function (e) {
                    // console.log(e.target.innerHTML, e.target.tagName)
                    if(this.mousePressed === false) return;

                    var element = null;

                    if(e.changedTouches) {
                        element = document.elementFromPoint(e.changedTouches[0].pageX - window.scrollX, e.changedTouches[0].pageY - window.scrollY);
                        this.touchPressed = false;
                    }
                    else {
                        element = e.target;
                    }

                    if(element.tagName === 'SPAN' || element.tagName === 'span') {

                        this.endX = Number(element.getAttribute('data-x'));
                        this.endY = Number(element.getAttribute('data-y'));

                        var incX = 0;

                        if(this.startX < this.endX) incX = 1;
                        else if(this.startX > this.endX) incX = -1;

                        var word = '';

                        if(incX !== 0) {
                            var start = this.startX < this.endX ? {x: this.startX, y: this.startY} : {x: this.endX, y: this.endY},
                                end = this.startX < this.endX ? {x: this.endX, y: this.endY} : {x: this.startX, y: this.startY};
                            var y = start.x === this.startX ? this.startY : this.endY,
                                yinc = start.y < end.y ? 1 : -1;
                            if(start.y === end.y) yinc = 0;
                            var xdim = end.x - start.x,
                                ydim = end.y - start.y;
                            //console.log(xdim, ydim)
                            if(!(Math.abs(xdim) === Math.abs(ydim) || (xdim > 0 && ydim === 0) || (xdim === 0 && ydim > 0))) {
                                this.linesDrawn.pop();
                                this.mousePressed = false;
                                //console.log('getting out')
                                return;
                            }
                            for(var x = start.x; x <= end.x; x ++) {
                                word += this.grid[y][x];
                                // console.log(this.grid[x][y])
                                y += yinc;
                            }
                        } else {
                            // edge case = iterate along y instead
                            var start = this.startY < this.endY ? {x: this.startX, y: this.startY} : {x: this.endX, y: this.endY},
                                end = this.startY < this.endY ? {x: this.endX, y: this.endY} : {x: this.startX, y: this.startY};

                            var x = start.x;
                            var xdim = end.x - start.x,
                                ydim = end.y - start.y;

                            for(var y = start.y; y <= end.y; y ++) {
                                // console.log(y)
                                word += this.grid[y][x];
                            }
                        }

                        //console.log(word);

                        if(this.wordsStripped.includes(word) || this.wordsStripped.includes(word.split('').reverse().join(''))) {

                            // correct !

                            var actualWord = this.getWordForStripped(word);
                            // console.log(word, wordIdx, actualWord)

                            var targets = Array.prototype.slice.call(document.querySelector('.word-list').getElementsByTagName('div'));
                            for(var i = 0; i < targets.length; i++) {
                                var inner = targets[i].innerHTML;
                                // console.log(inner)
                                if(inner === actualWord || inner === actualWord.split('').reverse().join('')) {
                                    if(!TwinklGame.Utils.hasClass(targets[i], 'checked')) {
                                        TwinklGame.Utils.addClass(targets[i], 'checked');
                                        sounds['levelup'].play();
                                        this.numComplete++;
                                    }
                                    break;
                                }
                            }
                            if(this.numComplete === this.wordsStripped.length) {
                                this.stage = 'result';
                                sounds['swoosh'].play();
                                // tw.Utils.track('finish');
                            }
                            // tw.Utils.track('question-correct', actualWord);
                        } else {

                            // incorrect !

                            this.linesDrawn.pop();
                            sounds['wrong'].play();

                            // tw.Utils.track('question-incorrect', word);  // taken out as flood of data eg 'x'
                        }
                        this.mousePressed = false;
                    }
                },
                overspill: function (e) {
                    if(this.mousePressed === false && this.touchPressed === true) ;
                    else if(this.mousePressed === true && this.touchPressed === false) ;
                    else if(this.mousePressed === true && this.touchPressed === true) ;
                    else return;

                    var element = null;

                    if(e.changedTouches) element = document.elementFromPoint(e.changedTouches[0].pageX - window.scrollX, e.changedTouches[0].pageY - window.scrollY);
                    else element = e.target;

                    if(!element.className.includes('wordsearch-cell')) {
                        this.mousePressed = false;
                        this.touchPressed = false;
                        this.linesDrawn.pop();
                        sounds['wrong'].play();
                    }
                },
                getWordForStripped: function (wordStripped) {
                    // var wordIdx = this.wordsStripped.indexOf(wordStripped);
                    // var wordIdx = -1;
                    for(var i = 0; i < this.word_list_slice.length; i++) {
                        if(this.word_list_slice[i].wordStripped === wordStripped || this.word_list_slice[i].wordStripped === wordStripped.split('').reverse().join('')) {
                            return this.word_list_slice[i].word;
                        }
                    }
                },
                getBoundingClientRect: function (el) {
                    var rect = el.getBoundingClientRect();
                    if(typeof rect.x === 'undefined') rect.x = rect.left;
                    if(typeof rect.y === 'undefined') rect.y = rect.top;
                    return rect;
                },
                isMultiList: function () {
                    return (typeof this.word_lists !== 'undefined' && this.word_lists.length > 0);
                }
            },
            computed: {
                words: function () {
                    var scope = this;
                    return this.word_list_slice.map(function (wordObj) {
                        return wordObj.word;
                    }).filter(function (word) {
                        return !scope.unplaced.includes(word);
                    });
                },
                wordsStripped: function () {
                    var scope = this;
                    return this.word_list_slice.map(function (wordObj) {
                        return wordObj.wordStripped;
                    }).filter(function (wordStripped) {
                        return !scope.unplacedStripped.includes(wordStripped);
                    });
                },
            },
            mounted: function () {

                if(this.isMultiList()) {
                    for(var i = 0; i < this.word_lists.length; i++) {
                        this.word_lists[i].word_list.forEach(function (wordObject) {
                            Vue.set(wordObject, 'wordStripped', wordObject.word.replace(/ /g, '').replace(/-/g, '').replace(/'/g, '').toLowerCase());
                        });
                    }
                } else {
                    this.word_list.forEach(function (wordObject) {
                        Vue.set(wordObject, 'wordStripped', wordObject.word.replace(/ /g, '').replace(/-/g, '').replace(/'/g, '').toLowerCase());
                    });

                    this.word_list_slice = this.word_list.slice(0, 12);
                }

                window.addEventListener('resize', function () {
                    tw.Utils.fitText($('.wordsearch-cell'), 40);
                    //console.log('resize')
                });

                //if(this.background_music) sounds.music = new Howl({ src: [tw.Utils.getConfigAssetUrl(this.background_music)], autoplay: true, loop: true, volume: 0.1 });

                tw.Utils.attachButtonSounds(sounds['click']);

                Vue.nextTick(function () {
                    tw.Utils.removeClass(document.getElementById('preload-div'), 'loading');
                });

            }
        });

    };

    tw.createWordsearch = createWordsearch;

})(TwinklGame);