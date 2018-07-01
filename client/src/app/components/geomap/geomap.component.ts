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

  private stateIdName: any[];
  public statesNameMapping: Object;
  public statesPopulationByAgeGroups: Object;
  public statesJobs: Object;
  public statesTotalPopulationByName: any;
  private populationAsAnObject: Object;
  public updateGeoMap = true;
  public map_ChartData: any;

  public stateNameStateCode: any;

  public searchComponentStateData: State[] = [];

  public map_ChartOptions: Object;
  constructor(private usInfographicsService: UsInfographicsService) {
    this.generateMapOption();
  }

  ngOnInit() {
    (async () => {
      await this.loadInfographicsData().then(() => {
        this.populationAsAnObject = GeomapComponent.getAllStatesTotalPopulation(this.statesPopulationByAgeGroups);
        this.statesTotalPopulationByName = this.mapStateNameWithPopulation(this.populationAsAnObject, this.statesNameMapping);
        this.searchComponentStateData = this.mapStateNamePopulationStateCode(this.populationAsAnObject, this.statesNameMapping);
        console.log(this.statesNameMapping);

        this.stateIdName = this.objectToArray(this.statesNameMapping);
        this.stateNameStateCode = this.createStateCodeNameMappingToStateCode(this.statesNameMapping);
        console.log(this.stateNameStateCode);
        this.resetGeoMapData(this.stateIdName);
        this.generateMapOption();
      });
    })()
  }

  private generateMapOption(): void {
    this.map_ChartOptions = {
      region: 'US',
      displayMode: 'region',
      resolution: 'provinces',
      legend: 'none',
      enableRegionInteractivity: 'true',
      sizeAxis: {minSize: 1, maxSize: 10},
      colorAxis: {minValue: 1000000, maxValue: 32000000, colors: ['#B92B3D']},
      width: '100%',
      aggregationTarget: 'category',
      defaultColor: '#f5f5f5',
    };
    this.renderMap();
  }

  public addPopulationDataToGeoMap() {
    this.map_ChartData = [['State', 'Population'], ...(this.statesTotalPopulationByName)];
    this.renderMap();
  }

  public resetGeoMapData(stateFullNames: any) {
    this.map_ChartData = [
      ['Code', 'State'], ...stateFullNames
    ];
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
      case 0: { //Overview
        this.resetGeoMapData(this.stateIdName);
        this.generateMapOption();
        break;
      }
      case 1: { //Population
        this.generateMapOption();
        this.addPopulationDataToGeoMap();
        break;
      }
      case 2: { //Jobs
        this.generateMapOption();
        this.addPopulationDataToGeoMap();
        break;
      }

    }
  }

  stateSelected(stateId) {
    stateId =  stateId.toUpperCase();
    this.hightlightSelectedState(stateId);
    this.zoomInState(stateId);
  }

  private hightlightSelectedState(stateId) {
    this.map_ChartData = [['State', 'Population'], ['US-'+stateId, this.populationAsAnObject[stateId]]];
    console.log(this.map_ChartData);
    this.renderMap();
  }

  public zoomInState(stateId: string): void {
    this.map_ChartOptions['region'] = 'US-'+stateId;
    this.renderMap();
  }

  private objectToArray(obj: any): any[] {
    var result = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
    });
    return result;
  }

  private createStateCodeNameMappingToStateCode(obj): object{
    return Object.assign({}, ...Object.entries(obj).map(([a,b]) => ({ [b]: a, [a]: a})));
  }

  private renderMap(): void {
    this.updateGeoMap = !this.updateGeoMap;
  }
}
