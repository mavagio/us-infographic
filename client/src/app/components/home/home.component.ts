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


  public jobsData = [
    ['Job', '%'],
    ["agriculture", 60.0],
    ["manufacturing", 0.0],
    ["mining", 2.0],
    ["trade",30.0],
    ["domestic service", 0.0],
    ["professional service", 10.0]
  ];

  public populationData = [
    ["Age groups", "Population"],
    ["Under 5 Years", 148323],
    ["5 to 13 Years", 241326],
    ["14 to 17 Years", 112801],
    ["18 to 24 Years", 203097],
    ["25 to 44 Years", 517154],
    ["45 to 64 Years", 501604],
    ["65 Years and Over", 260051],
  ];


  public barChartOptions = {
    title: 'Population by age groups',
    legend: { position: 'none' },
    colors: ['green','blue'],
  };




public pichartoptions = {
    title: 'State Jobs',
    pieHole: 0.3,
  };





}
