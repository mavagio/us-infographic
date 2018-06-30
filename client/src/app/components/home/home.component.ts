import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GoogleChartComponent} from '../google-chart/google-chart.component';
import {UsInfographicsService} from "../../services/us-infographics.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  ngOnInit() {

  }

  constructor() { }


  public pichartdata = [
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ];

  public pichartoptions = {
    title: 'My Daily Activities',
    seriesType: 'bars',
    series: {5: {type: 'line'}},
    pieHole: 0.3,
  };





}
