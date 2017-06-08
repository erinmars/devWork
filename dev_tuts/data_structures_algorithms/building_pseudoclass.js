window.onload = function() {


    Building.prototype.countFloors = function() {
        console.log("I have", this.floors, 'floors');
    };

    function Building(floors) {
        //via prototying, creates an empty object that you can start building on.
        this.what = "building";
        this.floors = floors;

        return this;

    }

    const myHouse = new Building(3);
    const myOffice = new Building(8);
    myHouse.countFloors();
    myOffice.countFloors();

    //The results of the shared method depend on the unique instance values which
    //are created at call-time inside each function's scope.

    //NOTE: There are several methods of creating classes in JavaScript.
    //Pseudoclassical is the industry standard and is expected knowledge in an interview
    //You may see elements of this style in your favorite JS framework.

};