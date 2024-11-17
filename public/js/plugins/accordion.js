/*
 * ======================================================================
 * Class Accordion
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Accordion{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of accordion options
     */
    constructor(element, options){
        const defaults = {
            autoOpen:false,
            openIndex:0,
            autoClose:false,
            contentType:'html',
            width:'auto',
            height:'auto',
            dataType:'json',
            url:'web/json/accordion.json'
        }
        this.$element   = $(element);
        this.$html      = null;
        this.settings   = $.extend(defaults, options);
        this.version    = '0.1beta';
        this.init();
    }

    /**
     * @description Create accordion
     * @return {void}
     */
    create(){
        var html = '<dl class="accordion">';
        for(let i=0;i<this.entries.length;i++){
            if(this.settings.autoOpen && this.settings.openIndex === i){
                html += '<dt class="open">' + this.entries[i].title + '</dt>';
            }else{
                html += '<dt>' + this.entries[i].title + '</dt>';
            }
            html += '<dd>' + this.entries[i].content + '</dd>';
        }    
        this.html += '</dl>';
        this.$html = $(html);
        this.$element.append(this.$html);
        this.$element.find('dt').on('click', this.toggle);
    }

    /**
     * @description Get data of accordion
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            type:'GET',
            url:self.settings.url,
            dataType:self.settings.dataType,
            success:(data) => self.entries = data,
            complete:() => self.create(),
            error:(result) => console.error(result.statusText)
        });       
    }

    /**
     * @description Initialize accordion
     * @return {void}
     */
    init(){
        if(this.$element.data('url') !== undefined){
            this.settings.url = this.$element.data('url');
        }
        this.getData();
    }

    /**
     * @description Toggle Accordion
     * @return {void}
     */
    toggle(){
        if($(this).hasClass('close') || $(this).attr('class') === undefined){
            $(this).siblings().attr('class', 'close');         
            $(this).attr('class', 'open active');
        }else{
            $(this).attr('class', 'close');
        }
    }
}