import {Alert} from './plugins/alert.js';
import {AudioPlayer} from './plugins/audioplayer.js';
import {AutoComplete} from './plugins/autocomplete.js';
import {Captcha} from './plugins/captcha.js';
import {ColorPicker} from './plugins/colorpicker.js';
import {Combo} from './plugins/combo.js';
import {DataTable} from './plugins/datatable.js';
import {DatePicker} from './plugins/datepicker.js';
import {Draggable} from './plugins/draggable.js';
import {GoogleMaps} from './plugins/googlemaps.js';
import {Graph} from './plugins/graph.js';
import {Jauge} from './plugins/jauge.js';
import {JaugeRange} from './plugins/jaugeRange.js';
import {Meteo} from './plugins/meteo.js';
import {Clock} from './plugins/clock.js';
import {ScrollTop} from './plugins/scrollTop.js';
import {Signature} from './plugins/signature.js';
import {Tooltip} from './plugins/tooltip.js';
import {VideoPlayer} from './plugins/videoplayer.js';

'use strict';
const debug = false;
const level = '';
var collapsed = true;

if(typeof jQuery === 'undefined'){
    throw new Error('MDT Bootstrap\'s JavaScript requires jQuery');
}

const alert = new Alert();

function toggleClass(e){
    const element = $(e.target);
    if(element.hasClass('fa-minus')){
        element.removeClass('fa-minus');
        element.addClass('fa-plus');
    }else{
        element.removeClass('fa-plus');
        element.addClass('fa-minus');
    }
}

function toggleTheme(theme) {
    var link = $('#styles');
    if (theme === "Clair") {
        link.attr('href', 'web/css/styles.css');
    } else {
        link.attr('href', 'web/css/styles-dark.css');
    }
}

function collapseAll(){
    if(collapsed){
        $('#work .collapse').each(function(){
            $(this).collapse('show');
        })
        collapsed = false;
    }else{
        $('#work .collapse').each(function(){
            $(this).collapse('hide');
        })
        collapsed = true;
    }
}

function progress(){
    $('.progress-bar').each(function() {
        let percent = $(this).attr('aria-valuenow');
        $(this).animate({
            width:percent + '%'
        }, 50, 'linear');
    });
}

function resetForm(){
    $('#formContact')[0].reset();
}

function resetProgress(){
    $('.progress-bar').each(function() {
        $(this).css({
            width:0
        })
    });    
}

function scrolled(){
    const nav = $(document.querySelector('#menuTop'));
    if ($(window).scrollTop() >= 100) {
        nav.removeClass('menuTop');
        nav.addClass('menuScroll');
        nav.find('a').attr('data-direction', 'bottom');
    } else {
        nav.removeClass('menuScroll');
        nav.addClass('menuTop');
        nav.find('a').attr('data-direction', 'top');
    }
}

function switchFluid(checked){
    const main = $('main');
    if(checked){
        $(main).removeClass('container');
        $(main).addClass('container-fluid');
    }else{
        $(main).removeClass('container-fluid');
        $(main).addClass('container');
    }
}

function toggleDraggable(){
    const checked = $('#switch-draggable').prop('checked');
    const doubleClickZoomControl = $('#switch-disableDoubleClickZoom');
    const scrollwheelControl = $('#switch-scrollwheel');
    if(checked){
        doubleClickZoomControl.prop('disabled', false);
        scrollwheelControl.prop('disabled', false);
    }else{
        doubleClickZoomControl.prop('disabled', true);
        scrollwheelControl.prop('disabled', true);
    }
}

$(document).ready(function(){

    new ScrollTop();

    $('#menuTop a').on('click', function(e){
        let href = $(this).attr("href");

        if(href.charAt(0) != '#' || panels.filter(href).length == 0){
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        if(window.Location.hash != href){
            window.location.hash = href;            
        }
    
        $('html, body').scrollTop(0);
    });

    $('.collapseButton').on("click", (e)=>{
        toggleClass(e);
    });

    $('#formContact').submit(function(e){
        const self = this;
        let error = false;
        e.preventDefault();
        let url = $(this).attr("action");
        let method = $(this).attr("method");
        let data = $(this).serialize();
        let submit = $('#formContact button:submit');
        let reset = $('#formContact button:reset');
        
        $('#formContact').find('.is-invalid').removeClass('is-invalid');
        $('#formContact').find('.is-valid').removeClass('is-valid');

        if($('#name').val() === ''){
            $('#name').addClass('is-invalid');
            error = true;
        }else{
            $('#name').addClass('is-valid');
        }
        if($('#email').val() === ''){
            $('#email').addClass('is-invalid');
            error = true;
        }else{
            $('#email').addClass('is-valid');
        }
        if($('#subject').val() === ''){
            $('#subject').addClass('is-invalid');
            error = true;
        }else{
            $('#subject').addClass('is-valid');
        }
        if($('#message').val() === ''){
            $('#message').addClass('is-invalid');
            error = true;
        }else{
            $('#message').addClass('is-valid');
        }
        if($('#captcha_control').val() === '' || $('#captcha_control').val() !== $('#captcha').data('mdt.captcha').settings.value){
            $('#captcha_control').addClass('is-invalid');
            error = true;
        }else{
            $('#captcha_control').addClass('is-valid');
        }
        if(error){
            return false;
        }

        $.ajax({
            url:url,
            type:method,
            data:data,
            beforeSend:()=>{
                reset.attr('disabled', true);
                submit.attr('disabled', true);
                submit.html("<div class='spinner'></div> Exécution de l'envoi");
            },
            error:(e)=>{
                console.log(e);
            },
            success:(response)=>{
                reset.attr('disabled', false);
                submit.attr('disabled', false);
                if(response.success === true){
                    self.reset();
                    alert.show("L'email à bien été envoyé !", 'success');
                }else{
                    alert.show("L'email n'a pas pu être envoyé !", 'danger');
                }
            },
            complete:()=>{
                submit.html("Envoyer");
            }
        });
    });

    $('#formContact').on('reset', function(){
        $(this).find('.is-invalid').removeClass('is-invalid');
        $(this).find('.is-valid').removeClass('is-valid');
    });

    $('[data-plugin~="audioplayer"]').each(function(){
        this.data = $(this).data('mdt.audioplayer', (this.data = new AudioPlayer(this)));
    });

    $('[data-plugin~="autocomplete"]').each(function(){
        this.data = $(this).data('mdt.autocomplete', (this.data = new AutoComplete(this)));
    });

    $('[data-plugin~="captcha"]').each(function(){
        this.data = $(this).data('mdt.captcha', (this.data = new Captcha(this, {width:400, height:100, font:'bold 48px sans-serif'})));
    });

    $('[data-plugin~="clock"]').each(function(){
        this.data = $(this).data('mdt.clock', (this.data = new Clock(this)));
    });

    $('[data-plugin*="colorpicker"]').each(function(){
        this.data = $(this).data('mdt.colorpicker', (this.data = new ColorPicker(this)));
    });

    $('[data-plugin~="combo"]').each(function(){
        this.data = $(this).data('mdt.combo', (this.data = new Combo(this)));
    });

    $('[data-plugin~="DataTable"]').each(function(){
        this.data = $(this).data('mdt.DataTable', (this.data = new DataTable(this)));
    });

    $('[data-plugin~="datepicker"]').each(function(){
        this.data = $(this).data('mdt.datepicker', (this.data = new DatePicker(this)));
    });

    $('[data-plugin~="draggable"]').each(function(){
        this.data = $(this).data('mdt.draggable', (this.data = new Draggable(this)));
    });

    $('[data-plugin~="googlemap"]').each(function(){
        this.data = $(this).data('mdt.googlemaps', (this.data = new GoogleMaps(this)));
    });

    $('[data-plugin~="graph"]').each(function(){
        this.data = $(this).data('mdt.graph', (this.data = new Graph(this, {width:500, height:300})));
    });

    $('[data-plugin~="jauge"]').each(function(){
        this.data = $(this).data('mdt.jauge', (this.data = new Jauge(this, {font:'bold 24px arial', width:75, height:75})));
    });

    $('[data-plugin~="jaugeRange"]').each(function(){
        this.data = $(this).data('mdt.jaugeRange', (this.data = new JaugeRange(this, {font:'bold 24px arial', width:300, height:100})));
    });

    $('[data-plugin~="meteo"]').each(function(){
        this.data = $(this).data('mdt.meteo', (this.data = new Meteo(this)));
    });     

    $('[data-plugin~="signature"]').each(function(){
        this.data = $(this).data('mdt.signature', (this.data = new Signature(this)));
    });

    $('abbr').each(function(e){
        $(this).attr('data-plugin', 'tooltip');
    });

    $('[data-plugin~="tooltip"]').each(function(){
        this.data = $(this).data('mdt.tooltip', (this.data = new Tooltip(this)));
    });

    $('[data-plugin~="videoplayer"]').each(function(){
        this.data = $(this).data('mdt.videoplayer', (this.data = new VideoPlayer(this, {width:300, height:200})));
    });

    $('a[href="#"]').on('click',(e)=>{
        e.preventDefault();
    });

    $('#switch-fluid').on('change', (e)=>{
        switchFluid(e.currentTarget.checked);
        saveConfiguration();
    });

    $('#switch-cookies').on('change', ()=>{
        console.log('oui');
        saveConfiguration();
    });

    $('#switch-info-bulles').on('change', (e)=>{
        $('[data-plugin*="tooltip"]').each(function(){
            const tooltip = $(this).data('mdt.tooltip');
            tooltip.setDisabled(tooltip, e.target.checked);
        });
        saveConfiguration();
    });

    $('#toggleAll').on('click', ()=>{
        collapseAll();
    });

    $('#selectTheme').on('change', (e)=>{
        toggleTheme(e.target.value);
        saveConfiguration();
    });

    $('#map').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setMapType(e.target.value);
        saveConfiguration();
    });

    $('#style').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setStyle(e.target.value);
        saveConfiguration();
    });

    $('#switch-draggable').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setDraggable(e.target.checked);
        toggleDraggable();
        saveConfiguration();
    });

    $('#switch-disableDoubleClickZoom').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setDisableDoubleClickZoom(e.target.checked);
        saveConfiguration();
    });

    $('#switch-scrollwheel').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setScrollwheel(e.target.checked);
        saveConfiguration();
    });

    $('#switch-mapTypeControl').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setMapTypeControl(e.target.checked);
        saveConfiguration();
    });

    $('#switch-streetview').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setStreetViewControl(e.target.checked);
        saveConfiguration();
    });

    $('#switch-zoom').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setZoomControl(e.target.checked);
        saveConfiguration();
    });

    $('#switch-fullscreen').on('change', (e)=>{
        $('#googlemap').data('mdt.googlemaps').setFullScreenControl(e.target.checked);
        saveConfiguration();
    });

    // $(window).bind('scroll', function() {
    //     scrolled();
    // });

    $('.selectGraph').on('change', function(e){
        $(this).parent().parent().parent().parent().find('[data-plugin="graph"]').data('mdt.graph').setType(this.value);
        let switchGrid = $(this).parent().parent().parent().parent().parent().find('.grid');
        let switchPlot = $(this).parent().parent().parent().parent().parent().find('.plot');
        let graph = $(this).parent().parent().parent().parent().parent().find('[data-plugin="graph"]').data('mdt.graph').graph;
        switch(e.currentTarget.value){
            case 'bars':
                if($(this).parent().parent().find('.orientationGraph').is(':disabled')){
                    $(this).parent().parent().find('.orientationGraph').removeAttr('disabled');
                }
                if(switchGrid.is(':disabled')){
                    switchGrid.removeAttr('disabled');
                }
                if(switchGrid.is(':checked')){
                    graph.setGridEnabled();
                }else{
                    graph.setGridEnabled(false);
                }
                if(switchPlot.is(':disabled')){
                    switchPlot.removeAttr('disabled');
                }
                if(switchPlot.is(':checked')){
                    graph.setPlotEnabled();
                }else{
                    graph.setPlotEnabled(false);
                }
                break;
            case 'lines':
                if(!$(this).parent().parent().find('.orientationGraph').is(':disabled')){
                    $(this).parent().parent().find('.orientationGraph').attr('disabled', 'disabled');
                }
                if(switchGrid.is(':disabled')){
                    switchGrid.removeAttr('disabled');
                }   
                if(switchGrid.is(':checked')){
                    graph.setGridEnabled();
                }else{
                    graph.setGridEnabled(false);
                } 
                if(switchPlot.is(':disabled')){
                    switchPlot.removeAttr('disabled');
                }                                          
                if(switchPlot.is(':checked')){
                    graph.setPlotEnabled();
                }else{
                    graph.setPlotEnabled(false);
                }                                          
                break;
            case 'pie':
                if(!$(this).parent().parent().find('.orientationGraph').is(':disabled')){
                    $(this).parent().parent().find('.orientationGraph').attr('disabled', 'disabled');
                }
                if(switchGrid.is(':checked')){
                    switchGrid.prop('checked', false);
                }
                switchGrid.attr('disabled', 'disabled');  
                if(switchPlot.is(':checked')){
                    switchPlot.prop('checked', false);
                }
                switchPlot.attr('disabled', 'disabled');              
                break;
        }
    });

    $('.orientationGraph').on('change', function(){
        $(this).parent().parent().parent().parent().find('[data-plugin="graph"]').data('mdt.graph').graph.setOrientation(this.value);
    });
    
    $('.grid').on('change', function(){
        let graph = $(this).parent().parent().parent().parent().parent().find('[data-plugin="graph"]').data('mdt.graph').graph;
        if(!graph.settings.gridEnabled){
            graph.setGridEnabled();
        }else{
            graph.setGridEnabled(false);
        }
    });

    $('.plot').on('change', function(){
        let graph = $(this).parent().parent().parent().parent().parent().find('[data-plugin="graph"]').data('mdt.graph').graph;
        if(!graph.settings.plotEnabled){
            graph.setPlotEnabled();
        }else{
            graph.setPlotEnabled(false);
        }
    });

    $('#effacerSignature').on('click', ()=>{
        $(this).find('[data-plugin="signature"]').data('mdt.signature').clear();
        $('#sauverSignature').removeClass('disabled');
    });

    $('#chargerSignature').on('click', ()=>{
        $(this).find('[data-plugin="signature"]').data('mdt.signature').loadImage();
        $('#sauverSignature').addClass('disabled');
    });

    $('#sauverSignature').on('click', ()=>{
        if(!$('#sauverSignature').hasClass('disabled')){
            $(this).find('[data-plugin="signature"]').data('mdt.signature').downloadImage();
        }
    });

    $('#genererCaptcha').on('click', ()=>{
        $(this).find('[data-plugin="captcha"]').data('mdt.captcha').generate();
    });

    $('[data-plugin~="modal"]').on('click', (e)=>{
        e.preventDefault();
        $('#modalContainer').load('public/modal/modal.html', function(){
            $(this).find('video')[0].src = $(e.currentTarget).data('options');
            $('#dynamicModal').modal('show');
            $(this).find('video')[0].play();
            $('#dynamicModal').find('.btn-close').on('click', function(){
                $('#dynamicModal').find('video')[0].pause();
            });
        });
    });

    $('.collapse-button').on('click', function(){
        $('.collapse').collapse('hide');
    });

    $(document).on("click", function(e){
        if(((!$(e.target).closest(".datepicker-container").length) && !$(e.target).closest(".select").length) && $(e.target).data("mdt.datepicker") === undefined){
            const datepicker = $('.datepicker-container').prev().data('mdt.datepicker');
            if(datepicker){
                datepicker.hide(datepicker);
            }            
        }
        if((!$(e.target).closest(".color-picker-container").length) && $(e.target).data("mdt.colorpicker") === undefined){
            const colorpicker = $('.color-picker-container').prev().data('mdt.colorpicker');
            if(colorpicker){
                colorpicker.hide(colorpicker);
            }            
        }
        if((!$(e.target).closest(".autocomplete-container").length)){
            const autocomplete = $('.autocomplete-container').children().data('mdt.autocomplete');
            if(autocomplete){
                autocomplete.hide(autocomplete);
            }             
        }
        if(!$(e.target).closest(".combo-container").length){
            const combo = $('.combo-container').parent().data('mdt.combo');
            if(combo){
                combo.close();
            }    
        }
    });

    $('#pageNumber').on('change', function(){
        const DataTable = $('[data-plugin="DataTable"]').data('mdt.DataTable');
        DataTable.setRecordsPage(Number(this.value));
    });

    $('[data-plugin="DataTable"]').on('draw', function(){
        const DataTable = $(this).data('mdt.DataTable');
        $('#totalPages').text(`Page ${DataTable.currentPage} sur ${DataTable.totalPages}`);
        let nbProduits = DataTable.getTotalRecords();
        $('#totalRecords').text((nbProduits < 1 )?`${nbProduits} ${DataTable.settings.name[0]}`:`${nbProduits} ${DataTable.settings.name[1]}`);
    });

});