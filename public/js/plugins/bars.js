import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class BarsGraph
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Bars extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of bars graph options
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            width:500,
            height:300,
            dataType:'JSON',
            gridEnabled:true,
            grid:{
                color:'#e0e0e0',
                lineWidth:1.5,
                stepX:10,
                stepY:22
            },
            margins:{
                top:40,
                right:20,
                bottom:40,
                left:40
            },
            orientation:'vertical',
            padding:2,
            plotEnabled:true,
            type:'bar',
            url:'../mdt/web/json/graphData.json'
        }
        this.settings = $.extend(defaults, this.settings);
        this.$element.css({
            display:'inline-block',
            width:this.settings.width,
            height:this.settings.height
        });
        this.data = null;
        this.init();
    }

    /**
     * @description Draw bars
     * @return {void}
     */
    drawBars(){
        super.clear();
        this.drawGrid();
        for(let i=0;i<this.data.data.length;i++){
            var color = this.data.color;
            var positions = this.getPosition(i);
            super.drawRectangle(this, positions.x, positions.y, positions.width, positions.height, color);
            if(this.settings.plotEnabled){
                if(this.settings.orientation === 'vertical'){
                    super.drawText(this.data.data[i].label, positions.x + (positions.width / 2), this.settings.height - (this.settings.margins.bottom / 2), "bold 10px Arial");
                }else{
                    super.drawText(this.data.data[i].label, this.settings.margins.left / 2, positions.y + (positions.height / 2), "bold 10px Arial");
                }   
            }  
        }
        if(this.settings.plotEnabled){
            super.drawPlot();
        }
        this.drawTitle();
    }

    /**
     * @description Draw grid
     * @return {void}
     */
    drawGrid(){
        if(this.settings.gridEnabled){
            let x       = this.settings.margins.left;
            let y       = this.settings.margins.top;
            let width   = this.settings.width - (this.settings.margins.left + this.settings.margins.right);
            let height  = this.settings.height - (this.settings.margins.top + this.settings.margins.bottom);
            super.drawGrid(x, y, width, height, this.settings.grid.stepX, this.settings.grid.stepY, this.settings.grid.lineWidth, this.settings.grid.color, 'horizontal');
        }
    }

    /**
     * @description Draw title
     * @param {string} title 
     * @returns 
     */
    drawTitle(){
        if(this.data.title === '' || this.data.title === undefined){
            console.error('Title is not defined');
            return;
        }
        super.drawText(this.data.title, this.settings.width / 2, this.settings.margins.top / 2, "bold 14px Arial");
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
            complete:() => {this.drawBars()},
            error:(result) => {console.error(result.statusText)}
        });
    }

    /**
     * @designation Get position of bar
     * @param {number}} i Number of bar
     * @returns {object} positions of bar
     */
    getPosition(i){
        var x;
        var y;
        var width;
        var height;
        var paddings = this.settings.padding * (this.data.data.length - 1);
        if(this.settings.orientation === 'horizontal'){
            width   = ((this.settings.width - this.settings.margins.left - this.settings.margins.right) / 100) * this.data.data[i].value;
            height  = (this.settings.height - (paddings + this.settings.margins.top + this.settings.margins.bottom)) / this.data.data.length;
            x       = this.settings.margins.left;
            y       = this.settings.margins.top - 1 + (i * height) + (i * this.settings.padding);
        }else{
            width   = (this.settings.width - (paddings + this.settings.margins.left + this.settings.margins.right)) / this.data.data.length;
            height  = ((this.settings.height - (this.settings.margins.top + this.settings.margins.bottom)) / 100) * this.data.data[i].value;
            x       = this.settings.margins.left + 1 + (width * i) + (this.settings.padding * i);
            y       = this.settings.margins.top + ((this.settings.height - this.settings.margins.top - this.settings.margins.bottom) - height);
        }
        return {
            'x':x,
            'y':y,
            'width':width,
            'height':height
        }
    }

    /**
     * @description Set grid enabled
     * @return {void}
     */
    setGridEnabled(enabled = true){
        if(typeof(enabled) !== 'boolean'){
            throw new Error('setGridEnabled : is not boolean value (' + typeof(enabled) + ':' + enabled + ')');
        }
        this.settings.gridEnabled = enabled;
        if(this.data !== null){
            this.drawBars();
        }
    }

    /**
     * @description Set orientation of bars
     * @param {string} orientation Orientation of bars 
     */
    setOrientation(orientation){
        if(typeof(orientation) !== 'string'){
            throw new Error('setGridEnabled : is not string value (' + typeof(orientation) + ':' + orientation + ')');
        }
        this.settings.orientation = orientation;
        this.drawBars();
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
        this.settings.plotEnabled = enabled;
        if(enabled){
            this.settings.margins.left = 40;
            this.settings.margins.bottom = 40;
        }else{
            this.settings.margins.left = 20;
            this.settings.margins.bottom = 20;
        }
        if(this.data !== null){
            this.drawBars();
        }        
    }

    /**
     * @description Initialize bars graph
     * @return {void}
     */
    init(){
        super.create();
        this.getData();
        this.$element.append(this.$canvas);
    }
}

export {Bars};