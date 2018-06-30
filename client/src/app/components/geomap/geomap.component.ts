import { Component, OnInit } from '@angular/core';
import {UsInfographicsService} from "../../services/us-infographics.service";

@Component({
  selector: 'app-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.css']
})
export class GeomapComponent implements OnInit {


  public statesNameMapping: Object;
  public statesPopulationByAgeGroups: Object;
  public statesJobs: Object;
  public statesTotalPopulationByName: any;

  public updateGeoMap = true;

  public map_ChartData:any = [
    ['State', 'Popularity'],
  ];

  public map_ChartOptions = {
    region: 'US',
    displayMode: 'region',
    resolution: 'provinces',
    legend: 'none',
    enableRegionInteractivity: 'true',
    sizeAxis: {minSize:1,  maxSize: 10},
    colorAxis: {minValue: 1, maxValue:10,  colors: ['#B92B3D']},
    width: '100%',
    aggregationTarget: 'category',
  };

  constructor(private usInfographicsService: UsInfographicsService) { }

  ngOnInit() {
    (async () => {
      await this.loadInfographicsData().then(()=>{
        let populationAsAnObject = GeomapComponent.getAllStatesTotalPopulation(this.statesPopulationByAgeGroups);
        this.statesTotalPopulationByName = this.mapStateNameWithPopulation(populationAsAnObject, this.statesNameMapping);
        console.log(this.statesTotalPopulationByName);
        console.log("I should be after")
      });
    })()
  }



  public addData() {
    this.map_ChartData =  this.map_ChartData.concat(this.statesTotalPopulationByName);
    console.log(this.map_ChartData)
    this.renderMap();
  }

  public zoomInState(): void {
    this.map_ChartOptions['region'] = 'US-CA';
    this.renderMap();
  }

  private renderMap(): void {
    this.updateGeoMap = !this.updateGeoMap;
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
        this.statesPopulationByAgeGroups = data;
        resolve();
      });
    });
  }

  private static getAllStatesTotalPopulation(statesPopulations): any[] {
    let allStatePopulations: any = {};
    for(let statePopulation of statesPopulations){
      let currentState: string = statePopulation['State'];
      statePopulation['State'] = 0;
      allStatePopulations[currentState] = this.sumObjectProperties(statePopulation);
    }
    return allStatePopulations;
  }

  private mapStateNameWithPopulation(statesPopulations, statesNamesMapping): any[]{
    let statesNamesAndPopulations = [];
    for(let stateName of statesNamesMapping){
      let stateFullName = stateName[1];
      let stateTotalPopulation = statesPopulations[stateName[0]];
      statesNamesAndPopulations.push([stateFullName, stateTotalPopulation]);
    }
    return statesNamesAndPopulations;
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

}
