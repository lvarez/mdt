class Forbes400{
    constructor(element, options){
        const defaults = {

        };
        this.$element = $(element);
        this.settings = $.extend(defaults, options);
        this.init();
    }

    create(res){
        let html = '';
        for(let i=0;i<res.length;i++){
            html += '<h4><strong>' + res[i].personName + '</strong></h4>';
            html += '<p><img src="' + res[i].squareImage + '" width="100" height="100" style="float:left;margin:0 15px 15px 0">' + res[i].bios + '</p>';
            html += '<p>' + Math.round(res[i].finalWorth) + ' Millions de dollars</p>';
        }
        this.$element.append($(html));
    }

    getData(){
        $.ajax({
            type:'GET',
            dataType:'JSON',
            url:'https://forbes400.herokuapp.com/api/forbes400?limit=10',
            success:(res)=>{
                this.$element.append('Loading');
            },
            complete:(res) => {
                this.$element.html('');
                this.create(res.responseJSON)
            },
            error:(res) => {
                console.error(res);
            }
        });
    }

    init(){
        this.getData();
    }
}

export {Forbes400};