class Router{
    constructor(application){
        this.application = application;
        this.routes = [];
        window.addEventListener('hashchange', this.navigate);
    }

    //Ajoute une route
    addRoute(name, url){
        this.routes.push({
            name,
            url
        });
    }

    navigate(){
        const hash = window.location.hash;
        const route = this.routes.filter(route => hash.match(new RegExp(route.url)))[0];
    }
}