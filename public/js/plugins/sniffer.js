class Sniffer{
    constructor(){
        this.language           = navigator.language; 
        this.location           = window.location;
        this.screen             = screen.width + '*' + screen.height;
        this.screenAvailable    = screen.availWidth + '*' + screen.availHeight,
        this.userAgent          = navigator.userAgent;
    }
}