window.PearsonGL = window.PearsonGL || {};
window.PearsonGL.UIModule = window.PearsonGL.UIModule || {};

/*******************************************************************************
 * Class: UI Keypad Module
 * Description: An Author-able Keypad used in Successmaker to enable the Learner to make inputs with
 * the keypad instead of their device keyboard.

 * Any product can use the keypad. Use Successmaker Fluidlayout and section.json to copy the setup.
 * Any gadget with inputs can use the keypad, but you will need to add that gadget's inputs here so that the
 * keypad knows when to hide (blurred input), or show (focused input). 
 * It is only checking SB - see toggleKeypadVisibility
 * 
 *  @author Diane Dougherty
 *
 ******************************************************************************/

/**
 * Constructor
 */
PearsonGL.UIModule.productConf = {};
PearsonGL.UIModule.keypadConf = {}
PearsonGL.UIModule.keypadConf.collapsed = false;

PearsonGL.UIModule.keypad = (function() {
	
	var 
	//DOM refs
	$the_page,
	$keypad,
	$keypad_handle,
	$keypad_btns,
	$keypad_toggle_collapse,
	$storyboard,
	
	//math symbol vars
	division = '\xF7',
	multiply ='\xD7',
	toggle_pos_neg = '+/-', //	overline = spacing overscore \u203E
	var_x = '𝒙',//'𝒙', U+1D465 //doesn't show up on iPad - \u1D4CD - tried stringFromCharCode and a bunch of char codes - nothing seems to work.
	var_y = '𝒚', // U+1D466
	less_than ='\x3C',
	greater_than ='\x3E',
	equal = "=",
	decimal = ".",
	subtract = "\u2212",
	add = "\u002B",
	paren_left = "\u0028",
	paren_right = "\u0029",
	//U+1D46x \u1d464
	eventObj = {}, //an object containing keypad values that get passed in the trigger event so that a gadget can handle it.
	buttonId, // these keypad buttons have a descriptive id
	dataId, // this is the button gadget id that is used as a key input on the keypad
	
	$dragBounds = $(document),
	x2 = ($dragBounds.width() - 60), /* @ half the width of a small keypad*/
	y2 = ($dragBounds.height() - 100), /* @ 1/3 the height of a small keypad*/
	
	/**
	 * publicly accessible
	 */
	exports = {
		init: init,
		getMathSymbol : getMathSymbol
	};
	
	//END VARS
	
	/**
	 * return the public api (exports)
	 */
	return exports;
	function getMathSymbol(btnID){
		
		var theMathSymbol = "";
		
		switch (btnID) {
			case 'kp-division' : 
				theMathSymbol = division;
				break;
			case 'kp-multiply' : 
				theMathSymbol = multiply;
				break;
			case 'kp-toggle-pos-neg' : 
				theMathSymbol = toggle_pos_neg;
				break;
			case 'kp-less-than' : 
				theMathSymbol = less_than;
				break;
			case 'kp-greater-than' : 
				theMathSymbol = greater_than;
				break;
			case 'kp-var-x' : 
				theMathSymbol = var_x;
				break;
			case 'kp-var-y' : 
				theMathSymbol = var_y;
				break;
			case 'kp-equal' : 
				theMathSymbol = equal;
				break;
			case 'kp-decimal' : 
				theMathSymbol = decimal;
				break;
			case 'kp-subtract' : 
				theMathSymbol = subtract;
				break;
			case 'kp-add' : 
				theMathSymbol = add;
				break;
			case 'kp-paren-left' : 
				theMathSymbol = paren_left;
				break;
			case 'kp-paren-right' : 
				theMathSymbol = paren_right;
				break;
			case 'kp-delete' : 
				theMathSymbol = "delete";
				break;
		}
		
		return theMathSymbol;
	};
	
	/**
	 * initialize - manage DOM elements and other vars used by this component.
	 * @param opts - all the options you set up when the page loads.
	 */
	function init(opts) {
		$the_page = $(opts.the_page);
		$keypad = $the_page.find( ".ui-keypad" );
		$keypad_handle = $keypad.find('.ui-keypad-handle');
		$keypad_btns = $keypad.find(".keypad-button");
		$keypad_toggle_collapse = $keypad.find(".ui-keypad-toggle-collapse");
		$storyboard = $the_page.find( ".storyboard-identifier" );
		
		$keypad.hide();
		
		makeKeypad();
		/**
		 * reset the bounds if the window is resized.
		 */
		$( window ).resize(function() {
			if($keypad.length > 0){
				x2 = ($dragBounds.width() - ($keypad.width()/2));
				y2 = ($dragBounds.height() - $keypad_handle.height());
				$keypad.draggable({ 
					containment: [-100, 0, x2, y2 ]
				});
			}
		});
		
		/**
		 * creates the keypad button events, adds jquery ui for draggable and accordion
		 */
		function makeKeypad(){
			// jquery.ui.draggable to drag the keypad window boundaries
			// should be draggable 50% on both sides and up to the header at the bottom of the window
			x2 = ($dragBounds.width() - ($keypad.width()/2));
			y2 = ($dragBounds.height() - $keypad_handle.height());
			
			/**
			 * add jquery ui capabilities like draggable and accordion
			 * @param isActive - accordion property for whether or not the keypad loads in the collapsed state
			 */
			(function addJQueryUIElements(isActive){
				
				$keypad.draggable({ 
					handle: $keypad_handle,
					containment: [-100, 0, x2, y2 ]
				});
				$keypad.accordion({ 
					header: $keypad_toggle_collapse,
					autoHeight: true,
					heightStyle: "content",
					collapsible: true,
					animate: {
						easing: "swing",
						duration: "200"
					}
				});
			})();
			
			// loop over all the buttons and use unicode/hex values for math symbols.
			// the button gadget text label is not using a richtext, so you can't author MathML.
			var btnLen = $keypad_btns.length;
			var mathSymbol = "";
			var btnLabel = $();
			for(var i=0; i < btnLen; i++){
				var $key_btn = $($keypad_btns[i]);
				var btnId = $key_btn.attr('id');
				btnLabel = $key_btn.find('.button-text');
				if(btnId === "kp-division" || btnId === "kp-multiply" || btnId === "kp-toggle-pos-neg" ||
						btnId === "kp-less-than" || btnId === "kp-greater-than" || btnId === "kp-var-x" || btnId === "kp-var-y" || btnId === "kp-delete"){
					
					mathSymbol = getMathSymbol(btnId);
					//handle the delete key.
					if(btnId!=="kp-delete") {
						btnLabel.text(mathSymbol);
					}
				}
			};
			
			//remove default button gadget click events - just using accessibility highlighting.
			//events are click for text buttons, mouse-up for image buttons - 
			$keypad_btns.find("*").off("click mouseup keyup");
			
			var btnId = $(this).attr('id');
			var keyVal = "";
			var newVal = "";
			
			/**
			 * custom keypad button click event
			 * fireEvent to the window along with useful data
			 * used when click and key-up events occur.
			 */
			$keypad_btns.on("click" , function(e){
				
				e.preventDefault();
				
				btnId = $(this).attr('id');

				keyVal = btnId.substr(3);// key values are 0-9 and some basic math symbols like divide, plus, multiply
				
				//if the 4th item is a letter and not a number, it's a Math symbol. Gets the symbol.
				var iD_val = btnId.substr(3, 1);
				var isNumber = isFinite(iD_val);
				
				if(btnId.indexOf(0, 4)){
					if(!isNumber){
						mathSymbol = getMathSymbol(btnId);
						keyVal = mathSymbol;
					}
				};
				
				eventObj = {
						type: "keypadPress",
						buttonId :  btnId,
						dataId : $(this).attr('data-id'),
						keyVal : keyVal
					}
				
				console.log("BUTTON CLICK: BUTTON ID " + eventObj.buttonId + " " + eventObj.keyVal);
				
				$(this).trigger(eventObj);
				
			}).keyup(function (e) {
				if (e.keyCode === PearsonGL.utils.keyCode.tab) {
					PearsonGL.utils.focusItemOn(this);
				} else if(e.keyCode === PearsonGL.utils.keyCode.enter) {
					e.preventDefault();
					
					btnId = $(this).attr('id');
					
					keyVal = btnId.substr(3);
					
					//if the 4th item is a letter and not a number, it's a Math symbol. Gets the symbol.
					var iD_val = btnId.substr(3, 1);
					var isNumber = isFinite(iD_val);
					
					if(btnId.indexOf(0, 4)){
						if(!isNumber){
							mathSymbol = getMathSymbol(btnId);
							keyVal = mathSymbol;
						}
					};
					 
					eventObj = {
						type: "keypadPress",
						buttonId :  btnId,
						dataId : $(this).attr('data-id'),
						keyVal : keyVal	
					}
					
					//console.log("TABBED KEYUP: BUTTON ID " + eventObj.buttonId + " " + eventObj.keyVal);
					
					$(this).trigger(eventObj);
				}
			}).blur(function () {
				PearsonGL.utils.focusItemOff(this);
			});
			
			$keypad.show();
		
		};
		function showKeypad(focusedInput){
			
			var x_pos = focusedInput.offset().left + focusedInput.width() + 20;
			var y_pos = focusedInput.offset().top;
			$keypad.css({
				bottom: "auto",
				right: "auto",
				left: x_pos,
				top: y_pos
			});
			
			$keypad.show();
			
		};
		/**
		 * close the keypad if the mouse downs outside....
		 * check accessibility rules - close box vs click outside to close box.
		 */
//		 $( document ).on( "mousedown", function(e) {
//		    
//	    	if(e.pageY > 180 || e.pageX > 600){
//	    		
//	    		if ($keypad.is(':visible')
//			    		&& !$keypad.is(event.target) && !$keypad.has(event.target).length) {
//			    	$keypad.hide(); 
//			    }
//	    	}
//		 });
		
		/**
		 * Keypad is used with SB inputs.
		 * Find the inputs, if the input is focused, show the keypad
		 */
		function toggleKeypadVisibility(){
			//get the text inputs from SB, and check when they get focus
			var inputs = $storyboard.find('.enabled.sbinput');
			
			if(inputs && inputs.length > 0){
				var focusedInput = $();
				var blurredInput = $();
				var currentInputID = "";
				var blurredInputID = "";
				if(inputs.length > 0){
					//show the keypad
					$(inputs).on( "focus", function(e){
						currentInputID = $(this).attr('data-element');
						currentInput = focusedInput = $(this);
						
						showKeypad($(this));
					});
					//hide the keypad
					$(inputs).on( "blur", function(){
						blurredInput = $(this);
						blurredInputID = $(this).attr('data-element')
						if(blurredInputID !== currentInputID){
							$keypad.hide();
						}
					});
				};	
			}
		};
	};

})();

$(document).ready(function(){
	
	//pages.js dispatches PageShowEvent trigger - update the nav selected state each time the page loads.
	$(this).on("PageShowEvent", function(e, data){
		//scope all gadget dom refs to the visible page...
		var $the_page = $('body').find('.page:not(.hidden-page)');		
		
		PearsonGL.UIModule.keypad.init({
			the_page : $the_page
		});
	});
	
});