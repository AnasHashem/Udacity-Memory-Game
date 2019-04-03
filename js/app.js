const cards = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let opened = [];
let moves = 0;
let SolvedInMoves = 0;
let timeIs = 0;
let timer;
let started = false;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function populateCards(){
  shuffle(cards.concat(cards)).forEach(createCard);
}

function createCard(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

function getClassFromCard(card){
    return card[0].firstChild.className;
}

function reset(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    incrementMove();
    started = false;
    opened = [];
    SolvedInMoves = 0;
    timeIs = 0;
    clearTimeout(timer);
    $("#timer").html(0);
    // re-setup game
    gameSetup();
}

function isMatch(){
    if (getClassFromCard(opened[0]) === getClassFromCard(opened[1])){
        SolvedInMoves++;
        opened.forEach(function(card){
            card.animateCss('tada', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        opened.forEach(function(card){
            card.animateCss('shake', function(){
                card.toggleClass("open show");
            });
        });
    }
    opened = [];
    incrementMove();
    if (SolvedInMoves === 8){
        endGame();
    }
}

function startTimer(){
    timeIs += 1;
    $("#timer").html(timeIs);
    timer = setTimeout(startTimer, 1000);
}

function incrementMove(){
    moves += 1;
    $("#moves").html(moves);
    if (moves === 14 || moves === 20){
        minusStar();
    }
}

// event listener
function cardClick(event){
    // check opened or matched card
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        return;
    }
    // start the game if not yet
    if (!started) {
        started = true;
        timeIs = 0;
        timer = setTimeout(startTimer, 1000);
    }
    // is flipping legal..
    if (opened.length < 2){
        $(this).toggleClass("open show");
        opened.push($(this));
    }
    // when two are opened, do they match ..
    if (opened.length === 2){
        isMatch();
    }
}

//Coming Soon ... 26th April :P  >> Joke
function endGame(){
    // stop timer
    clearTimeout(timer);
    let stars = $(".fa-star").length;
    let playAgain = confirm(`Congrats! You just won the game in ${timeIs} seconds with ${stars}/3 stars. Do you want to play again?`);
    if (playAgain) {
    	reset();
    }
}

function minusStar(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

function displayStars(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

function gameSetup(){
    populateCards();
    displayStars();
    $(".card").click(cardClick);
}

$(document).ready(function(){
    gameSetup();
    $("#restart").click(reset);
    vex.defaultOptions.className = 'vex-theme-os';
});

// from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
                callback();
            }
        });
        return this;
    }
});
