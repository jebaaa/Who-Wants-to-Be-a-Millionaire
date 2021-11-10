/**
* Edits the number prototype to allow money formatting
*
* @param fixed the number to fix the decimal at. Default 2.
* @param decimalDelim the string to deliminate the non-decimal
*        parts of the number and the decimal parts with. Default "."
* @param breakdDelim the string to deliminate the non-decimal
*        parts of the number with. Default ","
* @return returns this number as a USD-money-formatted String
*		  like this: x,xxx.xx
*/
Number.prototype.money = function(fixed, decimalDelim, breakDelim){
	var n = this, 
	fixed = isNaN(fixed = Math.abs(fixed)) ? 2 : fixed, 
	decimalDelim = decimalDelim == undefined ? "." : decimalDelim, 
	breakDelim = breakDelim == undefined ? "," : breakDelim, 
	negative = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(fixed)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return negative + (j ? i.substr(0, j) +
		 breakDelim : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + breakDelim) +
		  (fixed ? decimalDelim + Math.abs(n - i).toFixed(fixed).slice(2) : "");
}

/**
* Plays a sound via HTML5 through Audio tags on the page
*
* @require the id must be the id of an <audio> tag.
* @param id the id of the element to play
* @param loop the boolean flag to loop or not loop this sound
*/
startSound = function(id, loop) {
	soundHandle = document.getElementById(id);
	if(loop)
		soundHandle.setAttribute('loop', loop);
	soundHandle.play();
}

/**
* The View Model that represents one game of
* Who Wants to Be a Millionaire.
* 
* @param data the question bank to use
*/
var MillionaireModel = function(data) {
	var self = this;

	// The 15 questions of this game
    this.questions = data.questions;

    // A flag to keep multiple selections
    // out while transitioning levels
    this.transitioning = false;

    // The current money obtained
 	this.money = new ko.observable(0);

 	// The current level(starting at 1) 
 	this.level = new ko.observable(1);

 	// The three options the user can use to 
 	// attempt to answer a question (1 use each)
 	this.usedFifty = new ko.observable(false);
 	this.usedPhone = new ko.observable(false);
 	this.usedAudience = new ko.observable(false);

 	// Grabs the question text of the current question
 	self.getQuestionText = function() {
 		return self.questions[self.level() - 1].question;
 	}

 	// Gets the answer text of a specified question index (0-3)
 	// from the current question
 	self.getAnswerText = function(index) {
 		return self.questions[self.level() - 1].content[index];
 	}

 	// Uses the fifty-fifty option of the user
 	self.fifty = function(item, event) {
 		if(self.transitioning)
 			return;
 		$(event.target).fadeOut('slow');
 		var correct = this.questions[self.level() - 1].correct;
 		var first = (correct + 1) % 4;
 		var second = (first + 1) % 4;
 		if(first == 0 || second == 0) {
 			$("#answer-one").fadeOut('slow');
 		}
 		if(first == 1 || second == 1) {
 			$("#answer-two").fadeOut('slow');
 		}
 		if(first == 2 || second == 2) {
 			$("#answer-three").fadeOut('slow');
 		}
 		if(first == 3 || second == 3) {
 			$("#answer-four").fadeOut('slow');
 		}
 	}

 	// Fades out an option used if possible
 	self.fadeOutOption = function(item, event) {
 		if(self.transitioning)
 			return;
 		$(event.target).fadeOut('slow');
 	}

 	// Attempts to answer the question with the specified
 	// answer index (0-3) from a click event of elm
 	self.answerQuestion = function(index, elm) {
 		if(self.transitioning)
 			return;
 		self.transitioning = true;
 		if(self.questions[self.level() - 1].correct == index) {
 			self.rightAnswer(elm);
 		} else {
 			self.wrongAnswer(elm);
 		}
 	}

 	// Executes the proceedure of a correct answer guess, moving
 	// the player to the next level (or winning the game if all
 	// levels have been completed)
 	self.rightAnswer = function(elm) {
 		$("#" + elm).slideUp('slow', function() {
 			startSound('rightsound', false);
 			$("#" + elm).css('background', 'green').slideDown('slow', function() {
 				self.money($(".active").data('amt'));
 				if(self.level() + 1 > 15) {
	 				$("#game").fadeOut('slow', function() {
	 					$("#game-over").html('You Win!');
	 					$("#game-over").fadeIn('slow');
	 				});
 				} else {
 					self.level(self.level() + 1);
 					$("#" + elm).css('background', 'none');
			 		$("#answer-one").show();
			 		$("#answer-two").show();
			 		$("#answer-three").show();
			 		$("#answer-four").show();
			 		self.transitioning = false;
 				}
 			});
 		});
 	}

 	// Executes the proceedure of guessing incorrectly, losing the game.
 	self.wrongAnswer = function(elm) {
 		$("#" + elm).slideUp('slow', function() {
 			startSound('wrongsound', false);
 			$("#" + elm).css('background', 'red').slideDown('slow', function() {
 				$("#game").fadeOut('slow', function() {
 					$("#game-over").html('Game Over!');
 					$("#game-over").fadeIn('slow');
 					self.transitioning = false;
 				});
 			});
 		});
 	}

 	// Gets the money formatted string of the current won amount of money.
 	self.formatMoney = function() {
	    return self.money().money(2, '.', ',');
	}
};

//i know you dont do this way, but i need it fast :/


const json_raw = `{
	"games" : [
		{
		    "questions" : [
		        {
		            "question" : "In what children's game are participants chased by someone designated ?",
		            "content" : [
		                "Tag",
		                "Simon Says",
		                "Charades",
		                "Hopscotch"
		            ],
		            "correct" : 0
		        },
		        {
		            "question" : "On a radio, stations are changed by using what control?",
		            "content" : [
		                "Tuning",
		                "Volume",
		                "Bass",
		                "Treble"
		            ],
		            "correct" : 0
		        },
		        {
		            "question" : "Which material is most dense?",
		            "content" : [
		                "Silver",
		                "Styrofoam",
		                "Butter",
		                "Gold"
		            ],
		            "correct" : 3
		        },
		        {
		            "question" : "Which state in the United States is largest by area?",
		            "content" : [
		                "Alaska",
		                "California",
		                "Texas",
		                "Hawaii"
		            ],
		            "correct" : 0
		        },
		        {
		            "question" : "What is Aurora Borealis commonly known as?",
		            "content" : [
		                "Fairy Dust",
		                "Northern Lights",
		                "Book of ages",
		                "a Game of Thrones main character"
		            ],
		            "correct" : 1
		        },
				{
				    "correct": 3,
				    "content": [
				        "developed the telescope",
				        "discovered four satellites of Jupiter",
				        "discovered that the movement of pendulum produces a regular time measurement",
				        "All of the above"
				    ],
				    "question": "Galileo was an Italian astronomer who"
				},
				{
				    "correct": 3,
				    "content": [
				        "the infrared light kills bacteria in the body",
				        "resistance power increases",
				        "the pigment cells in the skin get stimulated and produce a healthy tan",
				        "the ultraviolet rays convert skin oil into Vitamin D"
				    ],
				    "question": "Exposure to sunlight helps a person improve his health because"
				},
				{
				    "correct": 0,
				    "content": [
				        "a club or a local sport association for remarkable achievements",
				        "amateur athlete, not necessarily an Olympian",
				        "National Olympic Committee for outstanding work",
				        "None of the above"
				    ],
				    "question": "Sir Thomas Fearnley Cup is awarded to"
				},
				{
				    "correct": 1,
				    "content": [
				        "1968",
				        "1929",
				        "1901",
				        "1965"
				    ],
				    "question": "Oscar Awards were instituted in"
				},
				{
				    "correct": 2,
				    "content": [
				        "1998",
				        "1989",
				        "1979",
				        "1800"
				    ],
				    "question": "When did Margaret Thatcher became the first female Prime Minister of Britain?"
				},
				{
				    "correct": 2,
				    "content": [
				        "15th April",
				        "12th December",
				        "1st May",
				        "1st August"
				    ],
				    "question": "When is the International Workers' Day?"
				},
				{
				    "correct": 2,
				    "content": [
				        "1962",
				        "1963",
				        "1964",
				        "1965"
				    ],
				    "question": "When did China test their first atomic device?"
				},
				{
				    "correct": 3,
				    "content": [
				        "1904",
				        "1905",
				        "1908",
				        "1909"
				    ],
				    "question": "When did Commander Robert Peary discover the North Pole?"
				},
				{
				    "correct": 0,
				    "content": [
				        "819/sq. km",
				        "602/sq. km",
				        "415/sq. km",
				        "500/sq. km"
				    ],
				    "question": "What is the population density of Kerala?"
				},
				{
				    "correct": 1,
				    "content": [
				        "4 km",
				        "25 km",
				        "500 m to 9 km",
				        "150 km"
				    ],
				    "question": "What is the range of missile 'Akash'?"
				}
		    ]
		}
	]
}`

const json = JSON.parse(json_raw);
$(document).ready(function() {


			$("#problem-set").append('<option value="1"></option>');

		$("#pre-start").show();
		$("#start").click(function() {
			var index = $('#problem-set').find(":selected").val() - 1;
			console.log(json.games[0]);
			ko.applyBindings(new MillionaireModel(json.games[0]));
			$("#pre-start").fadeOut('slow', function() {
				startSound('background', true);
				$("#game").fadeIn('slow');
			});
		});

});
