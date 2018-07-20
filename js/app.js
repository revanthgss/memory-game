/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let cardNames=["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bomb","fa-bicycle"]
let activeCards=[];
let starCount=3;
let moves=0;
let time=0;
let start=true;

deck=document.querySelector('.deck');
restartbtn=document.querySelector('.restart');
buttons=document.querySelector('.button-wrapper');

function refresh() {
	moves=0;
	time=0;
	start=true;
	stars=document.querySelector('.stars');
	for(let star of stars.children){
		star.style.color='black';
	}
	document.querySelector('.timer').innerHTML="";
	document.querySelector('.moves').innerHTML="0";
	deck.innerHTML="";
	cardsList=shuffle(cardNames.concat(cardNames));
	for(let i=0;i<cardsList.length;i++){
		deck.innerHTML+=`<li class="card"><i class="fa ${cardsList[i]}"></i></li>`;
	}
}

function startTimer(){
	time++;
	timer=document.querySelector('.timer');
	timer.innerHTML=`${time} seconds`;
	timerId=setTimeout(startTimer,1000);
}

function displayCard(evt){
	evt.target.classList.add('open');
}

function appendToOpenCard(evt){	
	activeCards.push(evt.target.firstChild.classList[1]);
}

function matched(){
	cards=document.querySelectorAll('.card');
	for(let card of cards){
		icon = card.firstChild;
		if(icon.classList.contains(activeCards[0]))
			card.classList.add('match');
	}
	activeCards=[];
}

function notMatched(){
	cards=document.querySelectorAll('.card');
	for(let card of cards){
		if(card.classList.contains('open')&&(card.firstChild.classList.contains(activeCards[0])||card.firstChild.classList.contains(activeCards[1]))){
			card.classList.add('not-match');
			setTimeout(function(){
				card.classList.remove('open');
				card.classList.remove('not-match');
			},300)
		}
	}
	activeCards=[];
}

function allMatch(){
	cards=document.querySelectorAll('.card');
	for(let card of cards){
		if(!card.classList.contains('match'))
			return false;
	}
	return true;
}

function incrementMoves(){
	moveSpans=document.querySelectorAll('.moves');
	let moves=parseInt(moveSpans[0].textContent);
	moves++;
	for(let moveSpan of moveSpans)
		moveSpan.textContent=moves.toString();
	return moves;
}

function removeStar(moves){
	stars=document.querySelector('.stars');
	starCount--;
	let i=0;
	if(moves===14)
		i=2;
	else if(moves===20)
		i=1;
	stars.children[i].style.color='white';
}

function displayModal(){
	if(allMatch()){
		clearTimeout(timerId)
		document.querySelector('.modal-content').innerHTML=`
			<h3>Congratulations!!!</h3>
			<p>You won in ${moves} moves with ${starCount} stars.</p> 
			<p>and you took ${time} seconds</p>`;
		document.querySelector('.modal').style.display='block';
	}
}

function cardClicked(evt){
	if(start){
		start=false;
		startTimer();
	}
	if(evt.target.classList.contains('card')&&!evt.target.classList.contains('open')){
		displayCard(evt);
		appendToOpenCard(evt);
		if(activeCards.length==2){
			if(activeCards[0]===activeCards[1])
				setTimeout(matched,500);
			else
				setTimeout(notMatched,500);
			moves=incrementMoves();
			if(moves==14||moves==20)
				removeStar(moves);
		}
		setTimeout(displayModal,600)
	}
}

document.addEventListener('DOMContentLoaded',refresh);

deck.addEventListener('click', cardClicked);

buttons.addEventListener('click',function(evt){
	if(evt.target.classList.contains('button')){
		document.querySelector('.modal').style.display='none';
		if(evt.target.textContent==='YES'){
			clearTimeout(timerId);
			refresh();
		}
	}
})

restartbtn.addEventListener('click',function(){
	clearTimeout(timerId);
	refresh();
})
