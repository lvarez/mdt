/*
 * ======================================================================
 * Class ContextMenu
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class ContextMenu{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of context menu options 
     */
    constructor(element, options){
        const defaults = {
            width:200,
            height:'auto',
            items:null,
            styles:{
                ctx_menu:'context-menu'
            }
        }
        this.$element   = $(element);
        this.$html      = null;
        this.settings   = $.extend(defaults, options);
        this.mouseX     = null;
        this.mouseY     = null;
        this.url        = null;
        this.isOpen     = false;
        this.init();
    }

    /**
     * @description Create context menu
     * @param {*} e 
     * @return {void}
     */
    create(e){
        const self = this;
        const x = e.pageX - 15;
        const y = e.pageY - 15;
        if(this.isOpen)
        {
            this.setPosition(x, y);
            return;
        }
        this.$html = $(`
            <div class="${this.settings.styles.ctx_menu} no-select">
                ${this.getItems()}
            </div>
        `);
        this.setPosition(x, y);
        $('body').append(this.$html);
        this.isOpen = true;
        this.setEvents();
    }

    /**
     * @description Initialize context menu
     * @return {void}
     */
    init(){
        const self = this;
        this.getData();
        this.$element.on('contextmenu', (e)=>{
            e.preventDefault();
            self.create(e);
        });
    }

    /**
     * @description Get data of context menu
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            dataType:"json",
            type:'GET',
            url:'http://localhost/mvc/public/themes/default/json/contextmenu.json',
            success:(data) => {
                self.settings.items = data;
            },
            error:(result) => console.error(result) 
        });       
    }

    /**
     * @description Get items of context menu
     * @return {string}
     */
    getItems(){
        let items = this.settings.items.datatable;
        let html = '';
        for(let i=0;i<items.length;i++){
            switch(items[i].type){
                case 'separator':
                    html += '<hr>';
                    break;
                case 'menu':
                    html += '<a href="#" id="context-menu-' + items[i].title + '"><i class="' + items[i].icon + '"></i> ' + items[i].title + '</a>';
                    break;
            }
        }
        return html;
    }

    /**
     * @description Remove context menu
     * @return {void}
     */
    remove()
    {
        $(this.$html).remove();
        this.isOpen = false;
    }

    /**
     * @description Set events of contextmenu 
     * @return void
     */
    setEvents()
    {
        const self = this;
        $(document).on('click', (e) => {
            if ($(e.target).parents(".context-menu").length === 0) {
                self.remove();
            }
        });

        let items = this.settings.items.datatable;

        for(let i = 0; i < items.length; i++){
            if(items[i].action !== ''){
                $('#context-menu-' + items[i].title).click(function(){
                    eval(items[i].action);
                    this.remove();
                });
            }
        }

    }

    /**
     * Define the position of context menu
     * @param {int} x 
     * @param {int} y 
     */
    setPosition(x, y)
    {
        this.$html.css({
            top:y,
            left:x
        });        
    }
}

export {ContextMenu};