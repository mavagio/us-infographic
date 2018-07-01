import {Directive, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
    setTimeout(() =>{
      google.charts.load('current', {'packages':['corechart']});
        setTimeout(() =>{
          this.drawGraph(this.chartOptions,this.chartType,this.chartData,this._element)
        },1);
      },1
    );
  }

  drawGraph (chartOptions,chartType,chartData,ele) {
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {


      let wrapper;
      wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
        dataTable:chartData ,
        options:chartOptions || {},
        containerId: ele.id
      });

      google.visualization.events.addListener(wrapper, 'select', function() {
        let selection = wrapper.getChart().getSelection()[0];
        console.log(selection);
        console.log(chartData);
        var label = chartData [selection.row+1];
        console.log(label);
      });
      wrapper.draw();

    }

  }
}
