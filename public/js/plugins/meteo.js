import {Timer} from './timer.js';
/*
 * ======================================================================
 * Class Meteo
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Meteo{

    /**
     * @description Constructor
     * @return {void}
     */
    constructor(element, options){
        const defaults = {
            dataType:'JSON',
            url:'https://www.prevision-meteo.ch/services/json/lat=46.527935lng=6.608925'
        }
        this.element        = element;
        this.$element       = $(element);
        this.settings       = $.extend(defaults, options);
        this.results        = null;
        this.progressWidth  = 0;
        this.init();
    }

    /**
     * @description Get data of meteo
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            type:'GET',
            url:self.settings.url,
            dataType:self.settings.dataType,
            beforeSend:()=>{
                self.$element.html('');
                self.$element.append('<div class="spinner-container"><div class="spinner"></div><div class="legend">loading</div></div>');
            },
            success:(data) => {self.results = data},
            complete:() => { 
                self.refresh();
                $('.progress-refresh').data = new Timer(this.element).countdown(3600, 324, ()=>{
                    self.getData();
                }); 
            },
            error:(result) => {self.$element.append('<span class="error">'+ result.message +'</span>')},
        });
    }

    /**
     * @description Initialize Meteo
     * @return {void}
     */
    init(){
        this.getData();
    }

    /**
     * @description Refresh Meteo
     * @return {void}
     */
    refresh(){
        const self = this;
        this.$element.find('.spinner-container').remove();
        this.$element.html('');
        let html = '<div class="meteo">';
        html += '<div class="meteo-image"></div>';
        html += '<div class="meteo-content">';
        html += '<p id="meteo-temp">' + this.results.current_condition.tmp + '°</p>';
        html += '<p id="meteo-condition">' + this.results.current_condition.condition + '</p>';
        html += '<p>Humidité : ' + this.results.current_condition.humidity + ' %</p>';
        html += '&nbsp;&nbsp;<p>Pression : ' + this.results.current_condition.pressure + '</p>';
        html += '<p id="meteo-city">Lausanne</p>';
        html += '</div>';
        html += '<div class="progress-refresh">';
		html += '<div id="progress" class="progress-refresh-bar">&nbsp;</div>';
	    html += '</div>';
        html += '</div>';
        this.$element.append(html);      
        const meteoImg = this.$element.find('.meteo-image');
        meteoImg.css({
            backgroundImage: 'url(' + this.results.current_condition.icon_big + ')'
        });
    }
}

export {Meteo};