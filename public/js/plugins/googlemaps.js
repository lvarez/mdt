class GoogleMaps{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of googlemaps options
     */
    constructor(element, options){
        let defaults = {
            center:null,
            dataType:'JSON',
            latitude:46.527935,
            longitude:6.608925,
            zoom:15,
            zoomControl:false,
            streetViewControl:false,
            mapTypeControl:false,
            fullscreenControl:false,
            draggable:false,
            disableDoubleClickZoom:true,
            scrollwheel:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            styles:null,
            url:'public/json/googlemap.json'
        }
        this.carte      = null;
        this.element    = element;
        this.$element   = $(element);
        this.latlng     = null;
        this.settings   = $.extend(defaults, options);
        this.styles     = null;
        this.init();
    }

    /**
     * @description Create
     * @return {void}
     */
    create(){
        this.latlng = new google.maps.LatLng(this.settings.latitude, this.settings.longitude);
        const gOptions = {
            center:this.latlng,
            zoom:this.settings.zoom,
            zoomControl:this.settings.zoomControl,
            streetViewControl:this.settings.streetViewControl,
            mapTypeControl:this.settings.mapTypeControl,
            fullscreenControl:this.settings.fullscreenControl,
            draggable:this.settings.draggable,
            disableDoubleClickZoom:this.settings.disableDoubleClickZoom,
            scrollwheel:this.settings.scrollwheel,
            mapTypeId:this.settings.mapTypeId,
            styles:this.settings.styles
        };
        this.carte = new google.maps.Map(this.element, gOptions); 
        this.carte.panBy(0, -70);
        //création du marqueur
        var marqueur = new google.maps.Marker({
            position:this.latlng,
            map:this.carte,
            title:'Vazquez Luis'
        });
        // Création de l'info
        var contentInfo = '<span class="no-select"><strong>Vazquez Luis</strong><br/>Chemin de Renens 24<br/>1004 Lausanne</span>';

        var infoWindow = new google.maps.InfoWindow({
            content:contentInfo,
            position:this.latlng
        });

        google.maps.event.addListener(marqueur, 'click', function() {
            infoWindow.open(this.carte,marqueur);
        });

        infoWindow.open(this.carte,marqueur); 

    }

    /**
     * @description Create a marker
     * @return {void}
     */
    createMarker(){
        let marqueur = new google.maps.Marker({
            position:this.latlng,
            map:this.carte,
            title:'Vazquez Luis'
        });        
    }

    /**
     * @description 
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            dataType:self.settings.dataType,
            type:'GET',
            url:self.settings.url,
            success:(data) => { 
                self.styles = data.styles;
            },
            error:(result) => {
                let html; 
                switch(result.status){
                    case 404:
                        html = '<span class="error">404 Page non trouvée</span>';
                        break;
                    default:
                        html = '<span class="error">' + result.status + '</span>';
                        break;
                }
                self.$element.append(html);
            },
            complete:(data)=>{
                self.create();
                self.setStyle('blue');
            }            
        });
    }

    /**
     * @description Get map
     * @return {string} Name of map
     */
    getMap(){
        if(this.carte !== null){
            return this.carte.getMap();
        }
        return '';        
    }

    /**
     * @description Initialize googlemaps
     * @return {void}
     */
    init(){
        this.getData();
    }

    /**
     * @description Set info window
     */
    setInfoWindow(){
        
    }

    /**
     * @description Set draggable
     * @param {boolean} enabled Enabled state 
     */
    setDraggable(enabled){
        this.carte.setOptions({ draggable : enabled });
    }

    /**
     * @description Set draggable
     * @param {boolean} enabled Enabled state 
     */
    setDisableDoubleClickZoom(enabled){
        this.carte.setOptions({ disableDoubleClickZoom : !enabled });
    }

    /**
     * @description Set full screen control
     * @param {boolean} enabled Enabled state 
     */
    setFullScreenControl(enabled){
        this.carte.setOptions({ fullscreenControl : enabled });
    }

    /**
     * @description Set map type
     * @param {string} type Type of map
     * 
     * roadmap       displays the default road map view. This is the default map type.
     * satellite     displays Google Earth satellite images.
     * hybrid        displays a mixture of normal and satellite views.
     * terrain       displays a physical map based on terrain information.
     */
    setMapType(type){
        this.carte.setMapTypeId(type.toLowerCase());
    }

    /**
     * @description Set mapType control
     * @param {boolean} enabled Enabled state 
     */
    setMapTypeControl(enabled){
        this.carte.setOptions({ mapTypeControl : enabled });
    }

    /**
     * @description Set street view control
     * @param {boolean} enabled Enabled state 
     */
    setStreetViewControl(enabled){
        this.carte.setOptions({ streetViewControl : enabled });
    }

    /**
     * @description Set style
     * @param {boolean} style Style of map 
     */
     setStyle(style){
         if(style !== -1){
            this.carte.setOptions({ styles : this.styles[style] });
         }else{
            this.carte.setOptions({ styles : null });
         }
    }
    

    /**
     * @description Set scroll wheel
     * @param {boolean} enabled Enabled state 
     */
    setScrollwheel(enabled){
        this.carte.setOptions({ scrollwheel : enabled });
    }

    /**
     * @description Set zoom control
     * @param {boolean} enabled Enabled state 
     */
    setZoomControl(enabled){
        this.carte.setOptions({ zoomControl : enabled });
    }

    toConsole(){
        console.groupCollapsed('GoogleMaps');
        console.log('Plugin : ');
        console.log(this);
        console.log('Settings : ');
        console.log(this.settings);
        console.groupEnd();
    }
}

export {GoogleMaps};