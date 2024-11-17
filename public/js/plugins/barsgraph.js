import {Canvas} from '../plugins/canvas.js';

/*
 * ======================================================================
 * Class BarsGraph
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class BarsGraph extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of bars graph options
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            gridEnabled:false,
            gridColor:'#ffc000',
            gridScale:12,
            nbBars:13,
            height:300,
            orientation:'horizontal',
            padding:2,
            showGrid:true,
            type:'bar',
            url:null,
            width:500
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

    drawBars(){
        this.data = [65,58,42,75,40,61,78,37,15,41,29,65,58];//,65,58,42,75,40,61,65,58,42,75,40,61,78,37,15,41,29,65,58,42,75,40,61
        let colors = ["#0b6fc5", "#0b4d87", "#0a3962", "#1c5968", "#68737d", "#6ac9c8", "#2F7ED8", "#0D233A"];//, "#68737d", "#6ac9c8", "#2F7ED8", "#0D233A"
        super.drawRectangle(this, 0, 0, this.settings.width, this.settings.height, '#FFF');
        if(this.settings.gridEnabled){
            super.drawGrid(this.settings.gridScale, 1, this.settings.gridColor);
        }
        for(let i=0;i<this.settings.nbBars;i++){
            var color = colors[Math.floor(Math.random()*colors.length)];
            var positions = this.getPosition(i);
            super.drawRectangle(this, positions.x, positions.y, positions.width, positions.height, color);     
        }
    }

    /**
     * @description Get data of bars graph
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            dataType:'json',
            type:'GET',
            url:'',
            success:(data) => self.settings.data = data,
            error:(result) => console.error(result)            
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
        var paddings = this.settings.padding * (this.data.length + 1);
        if(this.settings.orientation === 'horizontal'){
            x = Math.floor((this.settings.padding * (i + 1)) + Math.floor(((this.settings.width - paddings) / this.data.length)* i));
            y = this.settings.height - ((this.settings.height/100)*this.data[i]);
            width = Math.floor((this.settings.width - paddings) / this.data.length);
            height = ((this.settings.height / 100) * this.data[i]);
        }else{
            x = 0;
            y = Math.round((this.settings.padding * (i + 1)) + (((this.settings.height - paddings) / this.data.length)* i));
            width = (this.settings.width / 100) * this.data[i];
            height = Math.floor((this.settings.height - paddings) / this.data.length);
        }
        return {
            'x':x,
            'y':y,
            'width':width,
            'height':height
        }
    }

    setGridSize(size){
        this.settings.gridScale = size;
        super.clear(this);
        this.drawBars();
    }

    /**
     * @description Set orientation of bars
     * @param {string} orientation Orientation of bars 
     */
    setOrientation(orientation){
        this.settings.orientation = orientation;
        super.clear(this);
        this.drawBars();
    }

    /**
     * @description Set number of bars
     * @param {number} nbBars Number of bars
     * @return {void}
     */
    setNbBars(nbBars){
        this.settings.nbBars = nbBars;
        super.clear(this);
        this.drawBars();
    }

    /**
     * @description Initialize bars graph
     * @return {void}
     */
    init(){
        if(this.$element.data('orientation') !== undefined){
            this.settings.orientation = this.$element.data('orientation');
        }
        super.create(this);
        this.drawBars();
        this.$element.append(this.$canvas);
    }
}

export {BarsGraph};