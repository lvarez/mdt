import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Pie
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Pie extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of pie options 
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            width:500,
            height:300,
            font:"bold 18px Arial",
            margins:{
                top:50,
                right:20,
                bottom:50,
                left:50
            }
        }
        this.data       = null;
        this.$element   = $(element);
        this.settings   = $.extend(defaults, this.settings);
        this.init();
    }

    /**
     * @description Draw pie
     * @return {void}
     */
    drawPie(){
        super.drawPie();
        this.drawTitle();
    }

    drawTitle(){
        if(this.data.title === '' || this.data.title === undefined){
            console.error('Title is not defined');
            return;
        }
        super.drawText(this.data.title, this.settings.width / 2, this.settings.margins.top / 2, this.settings.font);
    }

    /**
     * @description Get data of bars graph
     * @return {void}
     */
     getData(){
        const self = this;
        $.ajax({
            dataType:this.settings.dataType,
            type:'GET',
            url:this.settings.url,
            success:(data) => {self.data = data},
            complete:() => {this.drawPie()},
            error:(result) => {console.error(result)}
        });
    }

    /**
     * @description Initialize pie
     * @return {void}
     */
    init(){
        super.create();
        this.getData();
        this.$element.append(this.$canvas);
    }

}

export {Pie};