// LA = no bw + dg 9x9, MA = no bw can dg 10x10, HA = everything 12x12

        var search;

        function init() {

            search = TwinklGame.createWordsearch(lib.manifest, TwinklGame.Utils.getInitialConfig({

                title: 'Harry Potter',
                subtitle: 'Word Search',
                lets_go_text: "Let's go!",
                intro_title: 'How to play:',
                intro_text: 'Can you complete this word search?',
                intro_subtext: 'Find the hidden words in the grid of letters, then click and drag over it to mark it as complete!',
                play_button_text: 'Play',
                success_title: 'Good job!',
                success_text: 'You found all of the words!',
                play_again_button_text: 'Play Again',
                // word_list: [
                //     {word: 'lamb'},
                //     {word: 'chick'},
                //     {word: 'rain'},
                //     {word: 'buds'},
                //     {word: 'grow'},
                //     {word: 'spring'},
                //     // {word: 'flowers'},
                //     {word: 'blossom'},
                //     {word: 'daffodil'},
                //     {word: 'butterfly'},
                //     {word: 'hatch'},
                //     {word: 'go go go'},
                //
                // ],
                word_lists: [
                    {
                        name: 'Hogwarts',
                        image: lib.manifest.hogwarts.src,
                        word_list: [
                            {word: 'charms'},
                            {word: 'Dumbledore'},
                            {word: 'Fang'},
                            {word: 'Fawkes'},
                            {word: 'Gryffindor'},
                            {word: 'Hagrid'},
                            {word: 'Hufflepuff'},
                            {word: 'Lupin'},
                            {word: 'Mcgonagall'},
                            {word: 'potions'},
                            {word: 'Quidditch'},
                            {word: 'Ravenclaw'},
                            {word: 'Ron'},
                            {word: 'Harry'},
                            {word: 'Hermione'},
                            {word: 'Slytherin'},
                            {word: 'Snape'},
                        ]
                    },
                    {
                        name: 'Wizarding',
                        image: lib.manifest.wizarding.src,
                        word_list: [
                            {word: 'Crookshanks'},
                            {word: 'Dobby'},
                            {word: 'Dudley'},
                            {word: 'Dumbledore'},
                            {word: 'Fred'},
                            {word: 'Ginny'},
                            {word: 'Hagrid'},
                            {word: 'Hedwig'},
                            {word: 'Harry Potter'},
                            {word: 'Hermione'},
                            {word: 'Krum'},
                            {word: 'Luna'},
                            {word: 'Malfoy'},
                            {word: 'Neville'},
                            {word: 'Peeves'},
                            {word: 'Percy'},
                            {word: 'Remus'},
                            {word: 'Ron'},
                            {word: 'Severus Snape'},
                            {word: 'Sirius Black'},
                            {word: 'Tom Riddle'},
                            {word: 'Tonks'},
                            {word: 'Voldemort'},
                        ]
                    },
                    {
                        name: 'Beasts',
                        image: lib.manifest.beasts.src,
                        word_list: [
                            {word: 'Acromantula'},
                            {word: 'Basilisk'},
                            {word: 'Beast'},
                            {word: 'Crup'},
                            {word: 'Doxy'},
                            {word: 'Flobberworm'},
                            {word: 'Ghoul'},
                            {word: 'Glumbumble'},
                            {word: 'Gnome'},
                            {word: 'Griffin'},
                            {word: 'Grindylow'},
                            {word: 'Hippogriff'},
                            {word: 'Hodag'},
                            {word: 'Horklump'},
                            {word: 'Imp'},
                            {word: 'Kappa'},
                            {word: 'Knarl'},
                            {word: 'Kneazle'},
                            {word: 'Moke'},
                            {word: 'Yeti'},
                            {word: 'Phoenix'},
                            {word: 'Pixie'},
                            {word: 'Plimpy'},
                            {word: 'Pogrebin'},
                            {word: 'Salamander'},
                            {word: 'Snallygaster'},
                            {word: 'Tebo'},
                            {word: 'Thunderbird'},
                        ]
                    }
                ],
                word_lists_title: 'Select theme:',
                word_list_heading: 'Word list',
                background_image_url: { assetUrl: '' },
                foreground_image_url: { assetUrl: '' },
                theme_colour: 'orange-strong',
                key_stage: 'ks1',
                branding: 'twinkl',
                grid_size: 12,
                // background_music: {assetUrl: lib.manifest.music.src}

            }));

        }