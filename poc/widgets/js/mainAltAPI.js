/**
 * namespace
 */
var ec1Widget = ec1Widget || {};

/**
 * immediately invoked
 */
ec1Widget.widget = (function(){
	
	var
	// DOM refs
	$widget_id,
	$done_btn,
	$learner_input,
	
	//communication
	handshake_complete = false, /* ready was fired & widget processed the setState object*/
	interaction_result = "correct", /* model this after cmi object? */
	correct_responses = [];
	
	 //setup
	function buildWidget (opts) {
		// sample dom items
		var theQuestion = 'This is the question';
		var questionDom = '<div class="display-question">' + theQuestion + '</div>';
		var answerDom = '<div class="display-answer"><input id="learner_input" type="text" name="learner_input"/></div>';
		var messageDom = '<div id="message_output"></div>';
		
		$widget_id.append(questionDom);
		$widget_id.append(answerDom);
		$widget_id.append(messageDom);
		
		$learner_input = $widget_id.find('input#learner_input');
		
		// hide until setState is done.
		$widget_id.hide();
		
	};
	/**
	 * publicly accessible
	 */
	 publicAPI = {
		init: init,
		fireReady : fireReady,
		recieveMessage : recieveMessage
	 };
	
	return publicAPI;
	
	function init(opts) {
		// cache references to the DOM elements we need to manage
		$widget_id = $(opts.widget_id);

		buildWidget(opts);
	}
	/**
	 * when the Widget loads, it posts ready
	 * The Container will respond with an object that 
	 * includes scoring and state data for how the activity should look.
	 * 
	 * @param {event} window.onload event
	 */
	function fireReady(evt){
		
		var msg_obj = {
			name: "ready",
			state : "ready"
		};
		firePostMessage(msg_obj, '*');
		
	};
	/**
	 * Widget listens for and handles postMessage events from the Container
	 * 
	 * @param {event} window.postMessage event
	 */
	function recieveMessage(evt) {
		
//		do we want to use the origin property for security?
//		if (evt.origin !== "www.somedomain.com") {
//			return;
//		}
//		
		//switch based upon the name of the evt.data
		var d = evt.data;
		var name="";
		
		if(d.hasOwnProperty('name')) {
			
			name = d.name;
		
			switch (name) {
				case 'state_data' :
					handleSetState(d);
					break;
				case 'button_click' :
				case 'beforeunload' :
					handleButtonClick(d);
					break;
				case 'feedback_event' :
					handleFeedbackEvent(d);
					break;
				case 'update_play_state' :
					handleUpdatePlayState(d);
					break;
				case 'display_change' :
					handleDisplayChange(d);
					break;
				default :
					handleError(d);
					break;
			};
		}
	}
	/**
	 * POC design use - uses the draggable popup
	 */
	function handleDisplayChange(d) {
		$widget_id.show();
	 
		printConsoleMsg('handle move');
	}
	
	/**
	 * the widget receives data to setup the display of activity or other
	 * properties required by the activity.
	 * 
	 * @param object
	 * @return {object} window.postMessage object
	 */
	function handleSetState(d) {
		//set up the widget to show the state
		var hs_complete = false;
		
		
		//handle the cmi object properties
		if(d.hasOwnProperty('cmi')) {
			correct_responses = d.cmi.correct_responses;
			hs_complete = true;
		} else {
			//throw error -
			hs_complete = false;
		}
		
		var set_state_complete = {
			name: 'set_state_complete',
			'handshake_complete' : hs_complete
		};
		
		$widget_id.show();
	
		firePostMessage(set_state_complete, '*');
	};

	/**
	 * Response to Done or Try again button click event
	 * returns the learner response in the CMI? object
	 * Widget should wait for feedback event from Container 
	 * before change any states.
	 * 
	 * @param object
	 * @return {object} window.postMessage learner_response
	 */
	function handleButtonClick(d) {
		
		var event_type = '';
		var learner_response = {};
		
		if(d.hasOwnProperty('event_type')){
			event_type = d.event_type;
		}
		
		//return the Learner response and any useful feeback data
		if(event_type === 'first_attempt' || event_type === 'second_attempt' 
			|| event_type === 'beforeunload') {
			
			learner_response = getLearnerResponse();
			
			var return_obj = {
					name: 'learner_response',
					event_type : event_type,
					'cmi' : {
						'correct_response' : correct_responses,
						'learner_response' : learner_response,
						'interaction_result' : interaction_result //correct, incorrect, 
					}
				};
			
			printConsoleMsg('WIDGET: return learner response ' + learner_response);
		}
		
		switch(event_type){
			case 'first_attempt':
			case 'second_attempt':
			case 'beforeunload':
				firePostMessage( return_obj, '*' );
				break;
			case 'try_again' :
				resetStage(d);
				
				break;
			case 'show_answer':
				handleShowAnswer();
				break;
			default :
				handleError(d);
				break;
		};
		
	};
	/**
	 * process the learner response
	 * @return {object}
	 */
	function getLearnerResponse() {
		//get the response and return it
		var learner_response = {};
		
		learner_response.text_input = $('input#learner_input').val();
		 
		return learner_response;
		 
	};
	
	function handleFeedbackEvent(d) {
		
		printConsoleMsg('WIDGET: RECEIVED FEEDBACK SHOWN EVENT ');
		
	};
	
	function handleUpdatePlayState(d) {
		
		if(d.hasOwnProperty('state')) {
			
			var state = d.state;
			
			switch (state) {
				case 'try_again' :
					resetStage(d);
					break;
				case 'game_over' :
					handleGameOver(d);
					break;
				default :
					handleError(d);
					break;
			};
			
		}

	};
	
	function resetStage(){
		var return_obj = {};
		return_obj.name = 'try_again_clicked';
		return_obj.event_type = 'try_again_clicked';
		//clear the display of learner input
		$('input#learner_input').val('');
		//tell container to change the button to done again
		firePostMessage( return_obj , '*');
		
	};
	
	function handleGameOver(){
		printConsoleMsg('WIDGET: HANDLE GAME OVER ');
	};
	
	function handleShowAnswer(){
		var return_obj = {};
		return_obj.name = 'show_answer_clicked';
		return_obj.event_type = 'show_answer_clicked';
		
		firePostMessage( return_obj , '*');
		
		$('input#learner_input').val(correct_responses[0]);
	};
	
	function handleCorrectResponse(d) {
		printConsoleMsg('WIDGET: HANDLE CORRECT RESPONSE ');
	};
	
	function handleIncorrectResponse(d) {
		printConsoleMsg('WIDGET: HANDLE INCORRECT RESPONSE ');
	};
	
	/**
     * post the message to the Container
     * @param {object}{string} post_obj domain
     */
    function firePostMessage( post_obj, origin ) {
    	
    	window.parent.postMessage( post_obj , origin);
    	
    };
    /**
     * error handling?
     */
	function handleError(d) {
		var event_type;
		if(d.hasOwnProperty('event_type')) {
			//
		}
		
		printConsoleMsg('WIDGET: ERROR HANDLER Something went wrong...' + event_type);
	};
	
	function printConsoleMsg(msg) {
    	console.log(msg);
    };
	
	
})();


$(document).ready(function(){
	
	/**
	 *  call the public function...send dom references
	 */
	ec1Widget.widget.init({
		done_btn : "#widget-done-btn",
		widget_id : "#widget_1"
	});
	
	/**
	 *  listen for messages from the parent window
	 */
	window.addEventListener("message", ec1Widget.widget.recieveMessage, false);
	
	/**
	 *  fire ready. return ready message to the parent when the DOM is loaded. 
	 *  parent returns setState object so that the activity builds itself
	 *  according to authored values from param authoring.
	 */
	window.onload = ec1Widget.widget.fireReady();

	/**
	 * window.postMessage references...
	 * source : A reference to the window object that sent the message; 
	 * you can use this to establish two-way communication between two 
	 * windows with different origins.
	 * 
	 * Security concerns : If you do not expect to receive messages from other sites, 
	 * do not add any event listeners for message events. This is a completely foolproof 
	 * way to avoid security problems.
	 * always verify the syntax of the received message. Otherwise, a security hole in the site 
	 * you trusted to send only trusted messages could then open a cross-site scripting hole 
	 * in your site.
	 * 
	 * Always specify an exact target origin, not *, when you use postMessage to send data 
	 * to other windows. A malicious site can change the location of the window without your 
	 * knowledge, and therefore it can intercept the data sent using postMessage.
	 * Failure to check the origin and possibly source properties enables cross-site scripting attacks.
	 */	
});
