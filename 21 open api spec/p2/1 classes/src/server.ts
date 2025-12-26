import { once } from "helpful-decorators"; // also check this library for how you can create your own decorators
class DateClass {
    private timeZone:string;
    constructor(timeZone:string){
        this.timeZone = timeZone;
    }

    @once
    getTime(){// it will run only once due to this decorator
        var date = new Date();
        console.log("hi from getTime");
        return date.getTime()
    }
}

const dateClass = new DateClass("Asia/Kolkata");
dateClass.getTime();
dateClass.getTime();
dateClass.getTime();
dateClass.getTime();
// check how many times getTime is called
