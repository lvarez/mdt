import {Bars} from './bars.js';
import {Lines} from './lines.js';
import {Pie} from './pie.js';

/*
 * ======================================================================
 * Class Graph
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Graph{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {object} options Array of graph options
     */
    constructor(element, options){
        const defaults = {
            dataType:'json',
            url:'../mdt/web/json/graphData.json',
            graphType:'bars'
        };
        this.element    = element;
        this.$element   = $(element);
        this.graph      = null;
        this.settings   = $.extend(defaults, options);
        this.init();
    }

    /**
     * @description Create graph
     * @return {void}
     */
    create(){
        switch(this.settings.graphType){
            case 'bars':
                this.graph = new Bars(this.element, this.settings);
                break;
            case 'lines':
                this.graph = new Lines(this.element, this.settings);
                break;
            case 'pie':
                this.graph = new Pie(this.element, this.settings);
                break;
        }
    }

    /**
     * @description Get data of graph
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            dataType:self.settings.dataType,
            type:'GET',
            url:self.settings.url,
            success:(data) => {},
            complete:() => {this.create()},
            error:(error) => {console.error(error)}
        });
    }

    /**
     * @description Initialise graph$
     * @return {void}
     */
    init(){
        if(this.$element[0].hasAttribute('data-options')){
            const options = this.$element.data('options');
            this.settings = $.extend(this.settings, options);
        }   
        this.create();
    }

    /**
     * @description Set type of graph
     * @param {string} type Type of graph (bars|lines|pie)
     * @return {void}
     */
    setType(type){
        this.$element.html('');
        switch(type){
            case 'bars':
                this.graph = new Bars(this.element, this.settings);
                break;
            case 'lines':
                this.graph = new Lines(this.element, this.settings);
                break;
            case 'pie':
                this.graph = new Pie(this.element, this.settings);
                break;
        }
    }

}

export {Graph}