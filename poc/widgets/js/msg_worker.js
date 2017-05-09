self.addEventListener('message', function(e) {
  self.postMessage(e.data);
}, false);

function recieveMessage(evt) {
	
//	do we want to use the origin property?
//	if (evt.origin !== "www.somedomain.com") {
//		return;
//	}
//	    
	var d = evt.data;
	var name="";
	
	if(d.hasOwnProperty('name')) {
		
		name = d.name;
	
		switch (name) {
			case 'state_data' :
				handleSetState(d);
				break;
			case 'done_click' :
				handleDoneBtnClick(d);
				break;
			case 'display_popup' :
				handleMove(d);
				break;
			default :
				handleError(d);
				break;
		};
	}
}

function handleMove(d) {
	$widget_id.show();
	console.log( 'handle move' );
}

function handleSetState(stateObj) {
	//set up the widget to show the state
	$widget_id.show();
	handshake_complete = true;
};

function handleDoneBtnClick(d) {
	//return the Learner response and any useful feeback data
	var return_obj = {
		"cmi_interaction_status" : learner_response
	};
	console.log("return Learner Response" + return_obj.cmi_interaction_status );
	window.parent.postMessage( return_obj , '*');
};

function handleError(d) {
	console.log('Something went wrong...');
};
