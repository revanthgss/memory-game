/***************************************************************/
/*********************Variable Declarations*********************/
/***************************************************************/

let cardNames=["fa-diamond","fa-paper-plane-o","fa-anchor","fa-bolt","fa-cube","fa-leaf","fa-bomb","fa-bicycle"]
let activeCards=[];
let starCount=3;
let moves=0;
let time=0;
let start=true;

deck=document.querySelector('.deck');
restartbtn=document.querySelector('.restart');
buttons=document.querySelector('.button-wrapper');

/***************************************************************/
/********************Function Declarations**********************/
/***************************************************************/

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

//Resets the state of game
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

//Starts and increments the timer after every second
function startTimer(){
	time++;
	timer=document.querySelector('.timer');
	timer.innerHTML=`${time} seconds`;
	timerId=setTimeout(startTimer,1000);
}

//Flips the card
function displayCard(evt){
	evt.target.classList.add('open');
}

//Add card to list of active cards
function appendToOpenCard(evt){	
	activeCards.push(evt.target.firstChild.classList[1]);
}

//Add match to active cards if they are matched
function matched(){
	cards=document.querySelectorAll('.card');
	for(let card of cards){
		icon = card.firstChild;
		if(icon.classList.contains(activeCards[0]))
			card.classList.add('match');
	}
	activeCards=[];
}

//Close the cards if they are not matched
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

//Returns true if all cards are matched
function allMatch(){
	cards=document.querySelectorAll('.card');
	for(let card of cards){
		if(!card.classList.contains('match'))
			return false;
	}
	return true;
}

//Increase number of moves by 1
function incrementMoves(){
	moveSpans=document.querySelectorAll('.moves');
	let moves=parseInt(moveSpans[0].textContent);
	moves++;
	for(let moveSpan of moveSpans)
		moveSpan.textContent=moves.toString();
	return moves;
}

//Deletes a star according to moves
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

//Display modal after all cards are matched
function displayModal(){
	clearTimeout(timerId)
	document.querySelector('.modal-content').innerHTML=`
		<h3>Congratulations!!!</h3>
		<p>You won in ${moves} moves with ${starCount} stars.</p> 
		<p>and you took ${time} seconds</p>`;
	document.querySelector('.modal').style.display='block';
}

//Event handler to handle click event of a card
function cardClicked(evt){
	//If game has started, start the timer
	if(start){
		start=false;
		startTimer();
	}
	if(evt.target.classList.contains('card')&&!evt.target.classList.contains('open')){
		displayCard(evt);
		appendToOpenCard(evt);
		//Check if there are two cards active
		if(activeCards.length==2){
			//If matched
			if(activeCards[0]===activeCards[1])
				setTimeout(matched,500);
			//If not matched
			else
				setTimeout(notMatched,500);
			moves=incrementMoves();
			//remove stars at certain moves
			if(moves==14||moves==20)
				removeStar(moves);
		}
		if(allMatch())
			setTimeout(displayModal,600);
	}
}

/*****************************************************/
/*******************Event listeners*******************/
/*****************************************************/

//Initialise game after dom is loaded
document.addEventListener('DOMContentLoaded',refresh);

deck.addEventListener('click', cardClicked);

//Event listeners to Try Again buttons
buttons.addEventListener('click',function(evt){
	if(evt.target.classList.contains('button')){
		document.querySelector('.modal').style.display='none';
		if(evt.target.textContent==='YES'){
			clearTimeout(timerId);
			refresh();
		}
	}
})

//Restart the game when restart button is clicked
restartbtn.addEventListener('click',function(){
	clearTimeout(timerId);
	refresh();
})
