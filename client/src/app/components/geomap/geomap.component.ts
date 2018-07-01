import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UsInfographicsService} from "../../services/us-infographics.service";
import {MatTabChangeEvent} from '@angular/material';
import {State} from "../../models/state";


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
  public map_ChartData: any;

  public searchComponentStateData: State[] = [];

  public map_ChartOptions = {
    region: 'US',
    displayMode: 'region',
    resolution: 'provinces',
    legend: 'none',
    enableRegionInteractivity: 'true',
    sizeAxis: {minSize: 1, maxSize: 10},
    colorAxis: {minValue: 1000000, maxValue: 32000000, colors: ['#B92B3D']},
    width: '100%',
    aggregationTarget: 'category',
  };

  constructor(private usInfographicsService: UsInfographicsService) {
    this.resetGeoMapData();
  }

  ngOnInit() {
    (async () => {
      await this.loadInfographicsData().then(() => {
        let populationAsAnObject = GeomapComponent.getAllStatesTotalPopulation(this.statesPopulationByAgeGroups);
        this.statesTotalPopulationByName = this.mapStateNameWithPopulation(populationAsAnObject, this.statesNameMapping);
        this.searchComponentStateData = this.mapStateNamePopulationStateCode(populationAsAnObject, this.statesNameMapping);
        console.log(this.searchComponentStateData);
      });
    })()
  }

  public addPopulationDataToGeoMap() {
    this.map_ChartData = this.map_ChartData.concat(this.statesTotalPopulationByName);
    this.renderMap();
  }

  public resetGeoMapData() {
    this.map_ChartData = [
      ['State', 'Population'],
    ];
    this.renderMap();
  }

  public zoomInState(): void {
    this.map_ChartOptions['region'] = 'US-CA';
    this.renderMap();
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
    for (let statePopulation of statesPopulations) {
      let currentState: string = statePopulation['State'];
      statePopulation['State'] = 0;
      allStatePopulations[currentState] = this.sumObjectProperties(statePopulation);
    }
    return allStatePopulations;
  }

  private mapStateNameWithPopulation(statesPopulations, statesNamesMapping): any[] {
    let statesNamesAndPopulations = [];
    for (let stateName in statesNamesMapping) {
      let stateFullName = statesNamesMapping[stateName]
      let stateTotalPopulation = statesPopulations[stateName];
      statesNamesAndPopulations.push([stateFullName, stateTotalPopulation]);
    }
    return statesNamesAndPopulations;
  }

  private mapStateNamePopulationStateCode(statesPopulations, statesNamesMapping): any[] {
    let statesNamesAndPopulations = [];
    for (let stateId in statesNamesMapping) {
      let stateFullName = statesNamesMapping[stateId]
      let stateTotalPopulation = statesPopulations[stateId];
      statesNamesAndPopulations.push({
        'name': stateFullName,
        'population': stateTotalPopulation,
        'id': stateId.toLowerCase(),
      });
    }
    return statesNamesAndPopulations;
  }


  private static sumObjectProperties(obj): number {
    return Object.keys(obj)
      .reduce(function (sum, key) {
        return sum + parseFloat(obj[key]);
      }, 0);
  }


  onTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1: { //Overview
        this.addPopulationDataToGeoMap();
        break;
      }
      case 2: { //Population
        this.zoomInState();
        break;
      }
      case 0: { //Jobs
        this.resetGeoMapData();
        break;
      }
    }
  }

  mytest(event) {
    console.log('evnt happend', event);
  }

  private renderMap(): void {
    this.updateGeoMap = !this.updateGeoMap;
  }
}
