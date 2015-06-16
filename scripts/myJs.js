 (function () {

     window.AudioContext = window.AudioContext || window.webkitAudioContext;
     var context = new AudioContext();
     var masterGain = context.createGain();
     masterGain.gain.value = 0.025;
     masterGain.connect(context.destination);

     var game = {
         init: function () {
             game.setup();
         },

         intro: function () {
             game.score = 0;
             game.speed = 500;
             game.gamePattern = [];
             game.playerPattern = [];
             $(".welcome").addClass("active");
             game.cycle([1, 2, 3, 4, 3, 2, 1], 100, game.begin);
         },

         map: {
             1: "g",
             2: "r",
             3: "y",
             4: "b"
         },
         playing: false,

         setup: function () {

             $(".box").on("mousedown", ".qtr", function (e) {
                 var which = $(this).data().which;
                 if (game.playing) {
                     game.playerPattern.push(which)
                     game.tone($(this).data().tone, 100);
                     game.checkPattern()
                 }
             });

             $(".replay").on("click", function () {
                 game.intro();
             });

             $(".no-thanks").on("click", function () {
                 $(".highscore").removeClass("active");
             });

             $(".highscore").on("keydown", "input", function (e) {
                 if (e.which == 13) {
                     $(".highscore").removeClass("active");
                     var playerName = $(this).val();
                     var playerScore = game.score;

                     $.post( "scripts/database.php", { name: playerName, score: playerScore } );

                     window.location = "./highscores.php";
                 }
             }).focus();

/*             $(window).on("keydown", function (e) {
                 if (e.which == 87) game.activate("g");
                 if (e.which == 69) game.activate("r");
                 if (e.which == 83) game.activate("y");
                 if (e.which == 68) game.activate("b");
             });*/

             game.intro();
         },

         begin: function () {
             $(".box").removeClass("final");
             game.score = 0;
             game.updateScore(0);
             setTimeout(game.play, 2000);
         },

         play: function () {
             if (game.playerPattern.length == game.gamePattern.length) {
                 game.playerPattern = [];
                 game.gamePattern.push(game.nextButton());
                 setTimeout(function () {
                     game.cycle(game.gamePattern, game.speed, function () {
                         game.ready(true);
                     });
                 }, 1000)
             }
         },

         correct: function () {
             game.score++;
             game.updateScore(game.score);
             game.play();
         },

         end: function () {
             $(".box").removeClass("ready");
             $(".box").addClass("final");
             game.ready(false);
             game.tone(50, 2000);
             game.cycle([1, 2, 3, 4], 500);
             if (game.score > 0) {
                 game.pushScoreWindow();
             }
         },

         manageScores: function (data) {
             function desc(a, b) {
                 return (b.score) > (a.score) ? 1 : -1;
             }
             var arr = [];
             for (var highscore in data) {
                 arr.push({
                     initials: data[highscore].initials,
                     score: data[highscore].score
                 })
             }
             arr.sort(desc);
             var top = arr.slice(0, 10);
             game.updateHighScores(arr);
             game.lowhigh = top[9].score;
         },

         pushScoreWindow: function () {
             $(".highscore").addClass("active");
             $("input").focus();
         },

         updateHighScores: function (array) {
             var $list = [];

             for (var x = 0; x < array.length; x++) {
                 var $new = $("<li />", {
                     "data-score": array[x].score,
                     "text": array[x].initials
                 });
                 $list.push($new);
             }
             $list = $list.splice(0, 10);
             $(".highscores ul").html($list);
         },

         ready: function (bool) {
             game.playing = bool;
             if (game.playing == true) {
                 $(".box").addClass("ready");
             } else {
                 $(".box").removeClass("ready");
             }
         },

         nextButton: function () {
             var rand = Math.floor(Math.random() * 4) + 1;
             return rand;
         },

         cycle: function (range, speed, callback) {
             if (game.ready) {
                 game.ready(false);
                 for (var x = 0; x < range.length; x++) {

                     function activateOne(start) {
                         setTimeout(function () {
                             if (typeof (start) == "number") {
                                 game.activate(game.getActual(start));
                             } else {
                                 game.activate(start);
                             }
                         }, speed * x);

                         if (x == range.length) {
                             setTimeout(game.ready, speed * x)
                         }

                     }
                     activateOne(range[x])
                 }

                 if (typeof (callback) == "function") {
                     callback();
                 }
             }
         },

         getActual: function (pos) {
             if (pos < 5) {
                 return game.map[pos];
             } else {
                 return game.map[pos - 4];
             }
         },

         activate: function (which) {
             var $el = $("." + which);
             $el.addClass("active");
             game.tone($el.data().tone, 100);
             setTimeout(function () {
                 $el.removeClass("active")
             }, 400);

             if (!game.playing) {
                 game.ready();
             }
         },

         checkPattern: function (which) {
             game.ready(false);
             var len = game.playerPattern.length;
             var against = game.gamePattern.slice(0, len);
             if (game.playerPattern.toString() == against.toString()) {
                 if (len == game.gamePattern.length) {
                     game.correct();
                 }
             } else {
                 game.end();
             }
             game.ready(true);
         },

         updateScore: function (score) {
             $(".score").text(score);
         },

         isHighScore: function () {
             return true;
         },

         pushScoreWindow: function () {
             $(".highscore").addClass("active");
         },

         tone: function (freq, length) {
             var oscillator = context.createOscillator();
             oscillator.type = 'square';
             oscillator.frequency.value = freq;
             oscillator.connect(masterGain);
             oscillator.start(0);
             setTimeout(function () {
                 oscillator.stop(0);
                 oscillator.disconnect();
             }, length);
         }
     }
     setTimeout(game.init, 1000);

 }());
