/**
 * 1. Learn Data Structure Concept
 *      - Draw it
 *      - Create the API/operations methods
 * 2. Build the Data Structure
 *      - Pseudocode the implementation
 *      - Code the data structure constructor
 * 3. Utilize the Data Structure
 *      - Put your data structure to work!
 *      - Pair it with an algorithm if needed
 * 4. Understand the Data Structure
 *      - What is the time complexity? (coming soon)
 *      - How can you optimize
 * 
 * To test this? Ask yourself - for instance - oh! I know how to do hashmaps!
 * if you can parse your idea through all of these steps, you're good.
 * 
 * Concept: Stacks  - "LIFO - last in first out, all you can do is push and pop
 * 
 * Diagram: Stacks - example is the call stack
 * 
 */

var makeBacon = function(style, n) {

};

var makeEggs = function(style, n) {
    var completedEgg;

    if (style !== "boiled") {
        var crackedEggs = crackEggs(n);
        if (style !== "scrambled") {
            completedEgg = fryEgg(crackedEggs, style)
        } else {
            var preppedEggs = whipEggs(crackedEggs);
            completedEgg = fryEgg(preppedEggs)
        }
    }
    //... other procedures here
    return completedEgg;
};

makeEggs('scrambled', 3);
makeBacon('crispy', 2);