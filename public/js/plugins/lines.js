import * as functions from '../core/functions.js';
import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Graph
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Lines extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of lines options 
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            animationDuration:1200,
            animationEnabled:false,
            height:300,
            width:500,
            dataType:'JSON',
            gridEnabled:true,
            grid:{
                color:'#e0e0e0',
                lineWidth:1.5,
                stepX:10,
                stepY:20
            },
            lineColor:'#395c81',
            lineWidth:1.5,
            margins:{
                top:40,
                right:20,
                bottom:40,
                left:40
            },
            orientation:'vertical',
            plotEnabled:true,
            url:'../mdt/web/json/graphData.json'
        }
        this.$element = $(element);
        this.$element.css({
            display:'inline-block',
            width:this.settings.width,
            height:this.settings.height
        });
        this.settings = $.extend(defaults, this.settings);
        this.data = null;
        this.init();
    }

    /**
     * @description Draw lines
     * @return {void}
     */
    drawLines(){
        super.clear();
        this.drawGrid();
        let x = this.settings.margins.left;
        let y = this.settings.height - this.settings.margins.bottom;
        for(let i=0;i<this.data.data.length;i++){
            let width = (this.settings.width - (this.settings.margins.left + this.settings.margins.right)) / this.data.data.length;
            let height = ((this.settings.height - (this.settings.margins.top + this.settings.margins.bottom)) / 100) *  this.data.data[i].value;
            super.drawLine(x, y, this.settings.margins.left + (((width / 2) * (i + 1)) + ((width/2) * i)), (this.settings.height - (height + this.settings.margins.bottom)), this.settings.lineColor, this.settings.lineWidth);
            if(i>0){
                super.drawArc(x, y, 3, 0, 2 * Math.PI, false, '#9cc6eb');
                super.drawArc(x, y, 3, 0, 2 * Math.PI, false, '#395c81', true, 1.5);
                super.drawText((100000 / 100) * this.data.data[i - 1].value, x, y + 15, 'bold 10px arial', '#000');
            }
            if(this.settings.plotEnabled){
                if(this.settings.orientation === 'vertical'){
                    super.drawText(this.data.data[i].label, this.settings.margins.left + (((width / 2) * (i + 1)) + ((width/2) * i)), this.settings.height - (this.settings.margins.bottom / 2), "bold 10px Arial");
                }else{
                    super.drawText(this.data.data[i].label, this.settings.margins.left / 2, y + (height / 2), "bold 9px Arial");
                }
            }
            x = this.settings.margins.left + (((width / 2) * (i + 1)) + ((width / 2) * i));
            y = (this.settings.height - (height + this.settings.margins.bottom));
            if(i === this.data.data.length - 1){
                super.drawLine(x, y, this.settings.width - this.settings.margins.right, this.settings.height - this.settings.margins.bottom, this.settings.lineColor, this.settings.lineWidth);
                super.drawArc(x, y, 3, 0, 2 * Math.PI, false, '#9cc6eb');
                super.drawArc(x, y, 3, 0, 2 * Math.PI, false, '#395c81', true, 1.5);
                super.drawText((100000 / 100) * this.data.data[i].value, x, y + 15, 'bold 9px arial', '#000');
            }
        }
        if(this.settings.plotEnabled){
            super.drawPlot();
        }
        this.drawTitle(this.data.title);
    }

    drawGrid(){
        if(this.settings.gridEnabled){
            let x       = this.settings.margins.left;
            let y       = this.settings.margins.top;
            let width   = this.settings.width - (this.settings.margins.left + this.settings.margins.right);
            let height  = this.settings.height - (this.settings.margins.top + this.settings.margins.bottom);
            super.drawGrid(x, y, width, height, this.settings.grid.stepX, this.settings.grid.stepY, this.settings.grid.lineWidth, this.settings.grid.color, "horizontal");
        }
    }

    /**
     * @description Draw title
     * @param {string} title
     * @return {void} 
     */
    drawTitle(title){
        if(this.data.title === '' || this.data.title === undefined){
            console.error('Title is not defined');
            return;
        }
        super.drawText(title, this.settings.width / 2, this.settings.margins.top / 2, "bold 14px Arial");
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
            success:(data) => {self.data = data;},
            complete:() => {this.drawLines()},
            error:(result) => {console.error(result)}
        });
    }

    /**
     * @description Initialise lines
     * @return {void}
     */
    init(){
        super.create();
        this.getData();
        this.$element.append(this.$canvas);
    }

    /**
     * @description Set gris enabled
     * @param {boolean} enabled
     */
    setGridEnabled(enabled = true){
        this.settings.gridEnabled = enabled;
        if(this.data !== null){
            this.drawLines();
        }
    }   
    
    /**
     * @description Set plot enabled
     * @param {*} enabled 
     * @return {void}
     */
     setPlotEnabled(enabled = true){
        if(typeof(enabled) !== 'boolean'){
            throw new Error('setPlotEnabled : is not boolean value (' + typeof(enabled) + ':' + enabled + ')');
        }
        if(enabled){
            this.settings.margins.left = 40;
            this.settings.margins.bottom = 40;
        }else{
            this.settings.margins.left = 20;
            this.settings.margins.bottom = 20;
        }
        this.settings.plotEnabled = enabled;
        if(this.data !== null){
            this.drawLines();
        }        
    }    
}

export {Lines};