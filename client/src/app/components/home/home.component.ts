import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {GoogleChartComponent} from '../google-chart/google-chart.component';
import {UsInfographicsService} from "../../services/us-infographics.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  public statesNameMapping: Object;
  public statesPopulation: Object;
  public statesJobs: Object;


   ngOnInit() {
     (async () => {
       await this.loadInfographicsData().then(()=>{
         console.log("I should be after")
         console.log(HomeComponent.getTotalStatePopulation("NY", this.statesPopulation));
       });
     })()
  }

  async loadInfographicsData(): Promise<any> {
    await new Promise<void>(resolve => {
      this.usInfographicsService.getJobsData().subscribe(data => {
        this.statesJobs = data;
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      this.usInfographicsService.getStatesData().subscribe(data => {
        this.statesNameMapping = data;
        resolve();
      });
    });
    await new Promise<void>(resolve => {
      this.usInfographicsService.getPopulationData().subscribe(data => {
        this.statesPopulation = data;
        resolve();
      });
    });
  }

  private static getTotalStatePopulation(stateId, statesPopulation): number {
    let statePopulation = this.findStatePopulation(stateId, statesPopulation);
    let totalPopulation = this.sumObjectProperties(statePopulation);
    return totalPopulation;
  }

  private static findStatePopulation(stateId, statesPopulation): any {
    for(let statePopulation of statesPopulation) {
      if(statePopulation['State'] === stateId) {
        statePopulation['State'] = 0;
        return statePopulation;
      }
    }
  }

  private static sumObjectProperties( obj ): number {
    return Object.keys( obj )
      .reduce( function( sum, key ){
        return sum + parseFloat( obj[key] );
      }, 0 );
  }

  constructor(private usInfographicsService: UsInfographicsService) { }

  public updateGeoMap = true;

  public map_ChartData = [
    ['State', 'Popularity'],
    ['Georgia', 2],
    ['Alabama', 3],
    ['New Mexico', 4],
    ['TX', 5],
    ['California', 10],
    ['IA', 7],
  ];

  public map_ChartOptions = {
    region: 'US',
    displayMode: 'markers',
    resolution: 'provinces',
    legend: 'none',
    enableRegionInteractivity: 'true',
    sizeAxis: {minSize:1,  maxSize: 10},
    colorAxis: {minValue: 1, maxValue:10,  colors: ['#B92B3D']},
    tooltip: {trigger: 'selection'},
    width: '100%',
    aggregationTarget: 'category',
  };

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

  public addData() {
    this.map_ChartData.push(['New York', 10]);
    this.renderMap();
  }

  public zoomInState(): void {
    this.map_ChartOptions['region'] = 'US-CA';
    this.renderMap();
  }

  private renderMap(): void {
    this.updateGeoMap = !this.updateGeoMap;
  }


}
