import {Modal} from '../../js/plugins/modal.js';
import {ContextMenu} from './contextmenu.js';
import {Tooltip} from './tooltip.js';

/*
 * ======================================================================
 * Class DataTable
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class DataTable{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of datatable options 
     */
    constructor(element, options){
        const defaults = {
            caption:null,
            columns:['width:40%', 'width:40%', 'width:70px', 'width:20%'],
            dataType:'json',
            type:'JSON',
            paging:true,
            pageRecords:20,
            paginateRecords:10,
            sortable:true,
            sortName:'Nom',
            sortDirection:'asc',
            styles:{
                pagination:'paginate',
                table:'tableMdt'
            },
            url:null
        };
        this.$element           = $(element);
        this.settings           = $.extend(defaults, options);
        this.$html              = null;
        this.data               = null;
        this.totalRecords       = null;
        this.pageCurrent        = 1;
        this.paginateCurrent    = 1;
        this.pageTotal          = null;
        this.init();
    }

    /**
     * @description Click
     * @param {*} e 
     * @return {void}
     */
    click(e){
        let pagination = $(e.target).closest('a').data('action');
        switch(pagination){
            case 'First' :
            case 'Premier':
                this.pageCurrent = 1;
                this.paginateCurrent = 1;
                this.$html.remove();
                this.create();
                break;
            case 'Previous' :
            case 'Précédent':
                if(this.pageCurrent !== 1){
                    this.pageCurrent = this.pageCurrent - 1;
                    if(this.pageCurrent % 10 === 0 && this.pageCurrent > 1){
                        this.paginateCurrent = this.paginateCurrent - 10;
                    }
                    this.$html.remove();
                    this.create();
                }
                break;
            case 'Next' :
            case 'Suivant':
                if(this.pageCurrent < this.pageTotal){
                    this.pageCurrent = this.pageCurrent + 1;
                    if(this.pageCurrent > this.paginateCurrent + 9){
                        this.paginateCurrent = this.paginateCurrent + 10;
                    }
                    this.$html.remove();
                    this.create();
                }
                break;
            case 'Last' :
            case 'Dernier':
                this.pageCurrent = this.pageTotal;
                this.paginateCurrent = this.pageTotal - 9;
                this.$html.remove();
                this.create();
                break;
            case 'paginatePlus':
                this.pageCurrent = this.pageCurrent + 10;
                this.paginateCurrent = this.paginateCurrent + 10;
                this.$html.remove();
                this.create();
                break;
            case 'paginateMinus':
                this.pageCurrent = this.pageCurrent - 10;
                this.paginateCurrent = this.paginateCurrent - 10;
                this.$html.remove();
                this.create();
                break;
            default:
                this.pageCurrent = Number(pagination);
                this.$html.remove();
                this.create();                
                break;
        }
    }

    /**
     * @description Create dataTable
     * @return {void}
     */
    create(){
        const self = this;
        let html = '<table class="table table-sm table-bordered table-striped table-hover tableData">';
        let rows = 0;
        if(this.settings.caption !== null){
            html += '<caption>' + this.settings.caption + '</caption>';
        }
        html += '<thead>';
        html += '<tr>';
        for(let field in this.settings.columns){
            if(this.settings.columns[field].visible === false){
                continue;
            }
            if(this.settings.sortName === this.settings.columns[field].data){
                if(this.settings.sortDirection === 'asc'){
                    html += '<th data-sort="' + this.settings.columns[field].data + '"' + ((this.settings.columns[field].width)?' style="width:' + this.settings.columns[field].width + '"':'') + '>' + this.settings.columns[field].label + '<i class="fa-solid fa-arrow-down-a-z"></i></th>';
                }else{
                    html += '<th data-sort="' + this.settings.columns[field].data + '"' + ((this.settings.columns[field].width)?' style="width:' + this.settings.columns[field].width + '"':'') + '>' + this.settings.columns[field].label + '<i class="fa-solid fa-arrow-down-z-a"></i></th>';
                }
            }else{
                html += '<th data-sort="' + this.settings.columns[field].data + '"' + ((this.settings.columns[field].width)?' style="width:' + this.settings.columns[field].width + '"':'') + '>' + this.settings.columns[field].label + '<i class="fa-solid fa-sort"></i></th>';
            }
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        let begin = (this.pageCurrent - 1) * this.settings.pageRecords;
        let end = begin + this.settings.pageRecords;
        for(let i=begin;i<end;i++){
            if(i>=this.totalRecords){
                break;
            }
            let record = this.data[i];
            html += '<tr data-id="' + record.id + '">';
            for(let column in this.settings.columns){
                for(let field in record){
                    if(this.settings.columns[column].data === field && this.settings.columns[column].visible !== false){
                        html += '<td' + ((this.settings.columns[column].className)?' class="' + this.settings.columns[column].className + '"':'') + '>' + record[field] + '</td>';
                   }
                }
            }
            html += '</tr>';
            rows++;
        }      
        html += '</tbody>';
        html += '</table>';
        if(rows < this.settings.pageRecords){
            const height = (27 * (this.settings.pageRecords - rows))  +'px';
            html += '<div class="tableData-page" style="height:' + height + '"></div>';
        }
        if(this.pageTotal > 1) 
        {
            html += '<div class="text-center">';
            html += '<ul class="' + this.settings.styles.pagination + '">';
            
            if(this.pageCurrent < 2){
                html += `   <li class="disabled"><a href="#" data-action="Premier"><i class="fa-solid fa-angles-left"></i></a></li>
                            <li class="disabled"><a href="#" data-action="Précédent"><i class="fa-solid fa-angle-left"></i></a></li>`
            }else{
                html += `   <li><a href="#" data-action="Premier"><i class="fa-solid fa-angles-left"></i></a></li>
                            <li><a href="#" data-action="Précédent"><i class="fa-solid fa-angle-left"></i></a></li>`
            }
            for(let i=1;i<=this.pageTotal;i++){
                if(this.pageCurrent === i){
                    html += '<li class="active"><a href="#" data-action="' + i + '">' + i + '</a></li>';
                }else{
                    html += '<li><a href="#" data-action="' + i + '">' + i + '</a></li>';
                }
            }

            // if(this.pageTotal > 10){
            //     if(this.paginateCurrent > 1){
            //         html += '<li><a href="#" data-action="paginateMinus">...</a></li>';
            //     }else{
            //         html += '<li class="disabled"><a href="#">...</a></li>';
            //     }
            // }


            // for(let i=this.paginateCurrent;i<=(this.paginateCurrent + this.settings.paginateRecords)-1;i++){
            //     if(this.pageCurrent === i){
            //         html += '<li class="active"><a href="#" data-action="' + i + '">' + i + '</a></li>';
            //     }else{
            //         html += '<li><a href="#" data-action="' + i + '">' + i + '</a></li>';
            //     }
            // }
            
            // if(this.pageTotal > 10){
            //     if(this.paginateCurrent < (this.pageTotal - 9)){
            //         html += '<li><a href="#" data-action="paginatePlus">...</a></li>';
            //     }else{
            //         html += '<li class="disabled"><a href="#">...</a></li>';
            //     }
            // }
            
            if(this.pageCurrent < this.pageTotal){
                html += `   <li><a href="#" data-action="Suivant"><i class="fa-solid fa-angle-right"></i></a></li>
                            <li><a href="#" data-action="Dernier"><i class="fa-solid fa-angles-right"></i></a></li>`
            }else{
                html += `   <li class="disabled"><a href="#" data-action="Suivant"><i class="fa-solid fa-angle-right"></i></a></li>
                            <li class="disabled"><a href="#" data-action="Dernier"><i class="fa-solid fa-angles-right"></i></a></li>`
            }
            html += `   </ul>
                     </div>`;
        }
        this.$html = $(html);
        this.setEvents();
        this.$element.append(this.$html);
        $('#datatable-total-records').text(this.totalRecords);
    }

    csv(filename = 'data.csv'){
        let result = '';
        for(let title in this.data[0]){
            result += title + '; ';
        }
        result = result.substring(0, result.length - 2);
        result += '\n';
        for(let line in this.data) {
            for(let field in this.data[line]){
                result += this.data[line][field] + '; ';
            }
            result = result.substring(0, result.length - 2);
            result += '\n';
        }
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename;  
        hiddenElement.click();  
    }

    /**
     * @description deleteRecord
     */
    deleteRecord(){
        alert("Êtes-vous sur de vouloir supprimer l'enregistrement");
    }

    /**
     * @description Get configuration file
     * @param {string} config 
     * @returns 
     */
    getConfig(config)
    {
        if(config === '')
        {
            return;
        }
        const self = this;
        $.ajax({
            dataType:self.settings.Type,
            type:'GET',
            url:config,
            beforeSend:(request)=>{ 
                self.$element.append('<div class="loading content"><span class="spinner-grow spinner-grow-lg" role="status" aria-hidden="true"></span></div>');
            },
            success:(data) => {
                self.$element.find('.loading').remove();
                self.settings = $.extend(self.settings, data);
            },
            error:(result) => {
                let html;
                self.$element.find('.loading').remove();
                switch(result.status){
                    case 404:
                        html = '<div class="content">Erreur 404 : <span class="error">Page non trouvée.</span></div>';
                        break;
                    default:
                        html = '<div class="content"><span class="error">' + result.status + '</span></div>';
                        break;
                }
                self.$element.append(html);
            },
            complete:() => {this.getDataTable();}
        });
    }

    /**
     * @description Get datatable
     * @return {void}
     */
    getDataTable(){
        const self = this;
        $.ajax({
            dataType:self.settings.dataType,
            type:'GET',
            headers: { token: '1234' },
            url:self.settings.url,
            beforeSend:()=>{
                self.$element.append('<div class="loading content"><span class="spinner-grow spinner-grow-lg" role="status" aria-hidden="true"></span></div>');
            },
            success:(data) => {
                self.$element.find('.loading').remove();
                self.data = data;
                self.totalRecords = self.data.length;
                self.sortLocale(self.settings.sortName, self.settings.sortDirection);
            },
            error:(result) => {
                self.$element.find('.loading').remove();
                let html; 
                switch(result.status){
                    case 200:
                        html = '';
                        break;
                    case 404:
                        html = '<div class="content"><span class="error">404 Page non trouvée</span></div>';
                        break;
                    default:
                        html = '<div class="content"><span class="error">' + result.status + '</span></div>';
                        break;
                }
                self.$element.append(html);
            },
            complete:()=>{
                self.getPages();
                self.create();  
            }
        });
    }

    /**
     * @description Get
     * @param {Boolean} end 
     * @returns 
     */
    getBeginEndPosition(end = false){
        let position = 1;
        position += this.pageCurrent * Number(this.settings.paginateRecords);
        if(end){
            position + Number(this.settings.paginateRecords);
        }
        return position;
    }

    /**
     * @description Get number of pages
     * @returns void
     */
    getPages(){
        this.pageTotal = Math.ceil(this.totalRecords / this.settings.pageRecords);
    }

    /**
     * @description Get total records
     * @returns Number
     */
    getTotalRecords()
    {
        return this.totalRecords;
    }

    /**
     * @description Initialize datatable
     * @return {void}
     */
    init(){
        if(typeof this.$element.data('options') !== 'undefined'){
            this.getConfig(this.$element.data('options'));
       }else{
           this.getDataTable();
       }
    }

    /**
     * @designation Limit text
     * @param {string} text Text to limit 
     * @param {number} limit Limit of text
     * @returns 
     */
    limitText(text, limit){
        if(text.length > limit){
            return text.substring(0, limit) + '...';
        }else{
            return text;
        }
    }

    refresh(){
        this.$element.empty();
        this.getDataTable();
    }

    print(){
        let win = window.open('index.html', '_blank');
        win.document.write('<html lang="fr"><head><title></title>');
        win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">');
        win.document.write('</head><body><table class="table table-striped">');
        let result = '<thead><tr>';
        for(let title in this.data[0]){
            result += '<th>' + title + '</th>';
        }
        result += '</tr></thead><tbody>';
        for(let line in this.data){
            result += '<tr>';
            for(let field in this.data[line]){
                result += '<td>' + this.data[line][field] + '</td>';
            }
            result += '</tr>';
        }
        win.document.write(result);
        win.document.write('</tbody></table></body></html>');
        win.document.close();
        win.onafterprint = window.close;
        win.print(); 
    }

    setEvents()
    {
        const self = this;

        this.$html.on('click', `.${this.settings.styles.pagination} a`, function(e){
            e.preventDefault();
            if(!$(e.target).parent().hasClass('disabled')){
                self.click(e);
            }
        });

        new ContextMenu(self.$html.find('tbody'));
        this.$html.on('contextmenu', (e)=>{
            e.preventDefault();
        });

        this.$html.find('tr:has(td)').each(function(){
            $(this).on('dblclick', ()=>{
                $('[id^=edit-]').trigger('click');
            });
        });

        this.$html.find('tr:has(td)').on('click', function(e){
            if(!$(this).hasClass('table-active')){
                $('tr').removeClass('table-active');
            }
            $(e.target).parent().addClass('table-active');
        });

        this.$html.find('tr:has(td)').on('contextmenu', function(e){
            if(!$(this).hasClass('table-active'))
            {
                $('tr').removeClass('table-active');
            }            
            $(e.target).parent().addClass('table-active');
        });

        this.$html.on('click', 'th', function(e){
            e.preventDefault();
            self.sort(e);
        });

        $('#recordsPage').on('change', (e)=>{
            $('#datatable').data('mdt.datatable').setRecordsPage(e.target.value);
        });       
    }

    /**
     * @description Set the number of page records
     * @param {Number} pageRecords 
     */
    setRecordsPage(pageRecords)
    {
        this.settings.pageRecords = pageRecords;
        this.$html.remove();
        this.create();
    }

    /**
     * @designation Sort
     * @param {object} e Event 
     * @return {void}
     */
    sort(e){
        const field = $(e.currentTarget).attr('data-sort');
        if(this.settings.sortName === field){
            if(this.settings.sortDirection === 'asc'){
                this.settings.sortDirection = 'desc';
                this.sortLocale(field, 'desc');
            }else{
                this.settings.sortDirection = 'asc';
                this.sortLocale(field, 'asc');
            }
        }else{
            this.settings.sortName = field;
            this.settings.sortDirection = 'asc';
            this.sortLocale(field, 'asc');
        }
        this.$html.remove();
        this.create();
    }

    /**
     * @description Sort by localCompare
     * @param {} prop 
     * @param {*} asc 
     * @param {*} locales 
     * @param {*} options 
     */
    sortLocale(prop, direction = 'asc', locales = 'fr', options = { sensitivity: 'base' })
    {
        if(direction === 'asc'){
            this.data = this.data.sort((a, b) => {return a[prop].localeCompare(b[prop], locales, options);});
        }
        else
        {
            this.data = this.data.sort((a, b) => {return b[prop].localeCompare(a[prop], locales, options);});
        }
    }

    /**
     * @designation Sort results
     * @param {string} prop 
     * @param {boolean} asc 
     * @param {boolean} caseSensitive
     * @return {void}
     */
    sortResults(prop, asc = true, caseSensitive = false) {
        if(caseSensitive){
            this.data = this.data.sort(function(a, b) {
                if(asc){
                    return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                } else {
                    return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                }
            });
        }else{
            this.data = this.data.sort(function(a, b) {
                if(asc){
                    return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
                } else {
                    return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
                }
            });
        }
    }
}

export {DataTable};