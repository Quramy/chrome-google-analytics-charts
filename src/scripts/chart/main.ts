///<reference path="../../../typings/bundle.d.ts" />

var mod = angular.module('chart', []);

interface IGaDataTable {
    __ensuered__?: boolean;
    cols: {
        id: string;
        label: string;
        type: string;
    }[];
    rows: {
        c: {v: any}[]
    }[];
}

class MainCtrl {
    dataTable: IGaDataTable;
    chartType: string;
    cols: string;
    chartTypes = [
        {label: 'Line Chart', value: 'LineChart'},
        {label: 'Bar Chart', value: 'BarChart'},
        {label: 'Column Chart', value: 'ColumnChart'},
        {label: 'Combo Chart', value: 'ComboChart'},
        {label: 'Pie Chart', value: 'PieChart'},
        {label: 'Scatter Chart', value: 'ScatterChart'},
        {label: 'Bubble Chart', value: 'BubbleChart'},
        {label: 'Calendar Chart', value: 'Calendar'},
        {label: 'Histograms', value: 'Histogram'}
    ];
    constructor(
        private $scope: ng.IScope
    ){
        this.chartType = 'LineChart';
        window.addEventListener('message', (event) => {
            this.dataTable = this.ensureDataTable(event.data.dataTable);
            this.drawChart(this.dataTable);
        }, false);
        $scope.$watch('main.chartType', this.render.bind(this));
    }

    ensureDataTable(input: IGaDataTable) {
        var row = 0, col = 0;
        var r, colType, val;
        for(row = 0; row < input.rows.length; row++){
            for(col = 0; col < input.cols.length; col++){ 
                colType = input.cols[col].type;
                r = input.rows[row];
                val = r.c[col].v as string;
                if(colType === 'number') {
                    r.c[col].v = Number(val);
                }else if(colType === 'date') {
                    r.c[col].v = (new Function('return new ' + val))();
                }else if(colType === 'boolean') {
                    r.c[col].v = !!(val.toLowerCase() === 'true');
                }else if(colType === 'datetime') {
                    // fix me later
                }else if(colType === 'timeofday') {
                    // fix me later
                }
            }
        }
        return input;
    }

    render() {
        if(!this.dataTable) return;
        this.drawChart(this.dataTable);
    }

    drawChart(dataTable: IGaDataTable){
        var cols: number[];
        var dt = new google.visualization.DataTable(dataTable);
        var view = new google.visualization.DataView(dt);
        var option = {
            width: 960, height: 480
        };
        if(this.cols && this.cols.length) {
            cols = this.cols.split(/[^\d]/).filter(t => !!t.length).map(d => parseInt(d));
        }
        var chart = new google.visualization[this.chartType](document.getElementById('chart'));
        if(cols && cols.length) view.setColumns(cols);
        chart.draw(view, option);
    }
}

mod.controller('MainCtrl', MainCtrl);

