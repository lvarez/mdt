class Timer{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of Timer options
     */
    constructor(element, options){
        const defaults = {
            progressClass:'',

        };
        this.$element = $(element);
        this.settings = $.extend(defaults, options);
        this.init();
    }

    convertHMS(value) {
        const sec = parseInt(value, 10); // convert value to number if it's string
        let hours   = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
        let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) {hours   = "0" + hours;}
        if (minutes < 10) {minutes = "0" + minutes;}
        if (seconds < 10) {seconds = "0" + seconds;}
        return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
    }

    countdown(duration, width, callback){
        const elementWidth  = width;
        const start         = Date.now();
        let intervalSetted  = null;
        let counter 		= 0;

        function timer(self) {
            if(counter > duration) {
                clearInterval(intervalSetted);
                callback();
                return;
            }
            let d = new Date(start);
            d.setSeconds(d.getSeconds() - counter);
            let time 	= null;
            const diff 	= start - d;
            const width = Math.floor((elementWidth / duration) * (duration - counter)); 

            $('#progress').animate({
                width: width + 'px'
            }, 500);

            time = self.convertHMS(duration - counter);
            $('.progress-refresh').attr('data-value', time);
            counter++;
       }
       timer(this);
       intervalSetted = setInterval(timer, 1000, this);
    }

    /**
     * @description Initialize Timer
     * @return {void}
     */
    init(){

    }
}

export {Timer};