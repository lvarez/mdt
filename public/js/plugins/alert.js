/*
 * ======================================================================
 * Class Alert
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Alert{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of alert options
     */
    constructor(element, options){
        const defaults = {
            width:100,                                                                                             
            height:40,                                                                                             
            dismissible:false,                                                                                      
            duration:5000,                                                                                         
            position:'top'
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.$html      = null;
        this.version    = '0.1 beta';
        this.init();
    }

    /**
     * @description Initialize alert
     * @return {void}
     */
    init(){
        const self = this;
        this.$element.on('click', (e)=>{
            const message = $(e.currentTarget).data('content');
            self.show(message);
        });
    }

    /**
     * @description Hide alert
     * @param {object} self HTML element 
     */
    hide(self){
        self.animate({
            top:'-100px'
        }, ()=>{
            self.remove();
        });
    }

    /**
     * @description Show alert
     * @return {void}
     */
    show(content, type = 'primary'){
        switch(type){
            case 'primary':
                this.$html = $('<div class="mdt-alert mdt-alertPrimary"><i class="fa fa-bell"></i> ' + content + '</div>');
                break;
            case 'info':
                this.$html = $('<div class="mdt-alert mdt-alertInfo"><i class="fa fa-bell"></i> ' + content + '</div>');
                break;
            case 'danger':
                this.$html = $('<div class="mdt-alert mdt-alertDanger"><i class="fa fa-bell"></i> ' + content + '</div>');
                break;
            case 'success':
                this.$html = $('<div class="mdt-alert mdt-alertSuccess"><i class="fa fa-bell"></i> ' + content + '</div>');
                break;
            case 'warning':
                this.$html = $('<div class="mdt-alert mdt-alertWarning"><i class="fa fa-bell"></i> ' + content + '</div>');
                break;
        }
        $('body').append(this.$html);
        this.$html.animate({
            top:'5px'
        }, setTimeout(this.hide, this.settings.duration, this.$html));
    }
}

export {Alert};