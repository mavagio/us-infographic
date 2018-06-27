import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GoogleChartComponent} from '../google-chart/google-chart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    console.log("chang eis detecte");
  }

  ngOnInit(): void {
  }

  constructor() { }

  public map_ChartData = [
    ['State', 'Popularity'],
    ['Georgia', 200],
    ['Alabama', 300],
    ['New Mexico', 400],
    ['Canada', 500],
    ['TX', 401],
    ['California', 1000],
    ['IA', 700]
  ];

  public map_ChartOptions = {
    region: 'US',
    displayMode: 'regions',
    resolution: 'provinces',
    legend: 'none',
    enableRegionInteractivity: 'true',
    sizeAxis: {minSize:1,  maxSize: 1000},
    colorAxis: {minValue: 1, maxValue:1000,  colors: ['#B92B3D']}
  };

  public addData() {
    this.map_ChartData = [
      ['State', 'Popularity'],
      ['Alabama', 3000],
      ['New Mexico', 400],
      ['Canada', 500],
      ['Texas', 600],
      ['California', 3000],
      ['IA', 700]
    ];

    this.map_ChartData.push(['Georgia', 200]);
    console.log(this.map_ChartData);
  }
}
