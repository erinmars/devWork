/**
 * Interface: Stacks
 * 
 * 1. Constructor Function
 *      - Storage
 * 2. Methods
 *      - push(value) //adds value to the front, returns size of stack
 *      - pop() //removes value from front, returns size of stack
 *      - size() //returns size of stack as an integer
 */

var Stack = function() {
    this.storage = ""; // our storage is a string to make it interesting
};

Stack.prototype.push = function(val) {
    this.storage = this.storage.concat("***", val);
};

Stack.prototype.pop = function(val) {
    //slice off the last chars up until ***
    var str = this.storage.slice(this.storage.lastIndexOf("***") + 3);

    //updating the new stack without the last item.
    this.storage = this.storage.substring(0, this.storage.lastIndexOf("***"));

    //return the last item
    return str;
};

Stack.prototype.size = function(val) {

};

var myWeeklyMenu = new Stack();

myWeeklyMenu.push("RedBeans");