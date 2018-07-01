import {Directive, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
declare var google:any;
declare var googleLoaded:any;
@Directive({
  selector: '[GoogleChart]'
})
export class GoogleChartComponent implements OnInit, OnChanges {

  public _element:any;
  @Input('chartType') public chartType:string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: Object;
  @Input('updateGeoMap') public updateGeoMap: boolean;

  @Output('selectedRegionEvent') selectedRegion = new EventEmitter<string>();
  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  private render() {
      google.charts.load('current', {'packages':['corechart']});
      this.drawGraph(this.chartOptions,this.chartType,this.chartData,this._element)
  }

  drawGraph (chartOptions,chartType,chartData,ele) {
    google.charts.setOnLoadCallback(drawChart);
    let _this = this;
    function drawChart() {
      let wrapper;
      wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
        dataTable:chartData ,
        options:chartOptions || {},
        containerId: ele.id
      });

      if (_this.chartType === 'GeoChart'){
        google.visualization.events.addListener(wrapper, 'select', function() {
          let selection = wrapper.getChart().getSelection()[0];
          let state = chartData[selection.row+1];
          _this.selectedRegion.emit(state[0]);
        });
      }

      wrapper.draw();
    }

  }
}
