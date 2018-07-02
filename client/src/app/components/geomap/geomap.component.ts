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
  @Output('selectedStateEvent') selectedStateEvent = new EventEmitter<string>();

  @Output('stateCodeToNameMappingEvent') stateCodeToNameMappingEvent = new EventEmitter<any>();
  @Output('stateJobsEvent') stateJobsEvent = new EventEmitter<any>();
  @Output('statePopulationByAgeGroupEvent') statePopulationByAgeGroupEvent = new EventEmitter<any>();
  @Output('populationAsAnObjectEvent') populationAsAnObjectEvent = new EventEmitter<any>();

  public selectedStateId: string;
  private geoChartDataStateIdName: any[];
  public statesNameMapping: Object;
  public statesPopulationByAgeGroups: Object;
  public statesJobs: Object;
  public statesTotalPopulationByName: any;
  private populationAsAnObject: Object;
  public updateGeoMap = true;
  public map_ChartData: any;

  public unemploymentData: Object;
  public unemploymentGeoMapData: any;

  public stateNameStateCode: any;

  public searchComponentStateData: State[] = [];

  public map_ChartOptions: Object;
  private currentTab: number = 0;

  constructor(private usInfographicsService: UsInfographicsService) {
    this.generateDefaultMapOption();
  }

  ngOnInit() {
    (async () => {
      await this.loadInfographicsData().then(() => {
        this.populationAsAnObject = GeomapComponent.getAllStatesTotalPopulation(this.statesPopulationByAgeGroups);
        this.statesTotalPopulationByName = this.mapStateNameWithPopulation(this.populationAsAnObject, this.statesNameMapping);
        this.searchComponentStateData = this.mapStateNamePopulationStateCode(this.populationAsAnObject, this.statesNameMapping);
        this.geoChartDataStateIdName = GeomapComponent.objectToArray(this.statesNameMapping);
        this.stateNameStateCode = GeomapComponent.createStateCodeNameMappingToStateCode(this.statesNameMapping);

        this.unemploymentGeoMapData = GeomapComponent.objectToArray(this.unemploymentData);

        this.stateCodeToNameMappingEvent.emit(this.statesNameMapping);
        this.stateJobsEvent.emit(this.statesJobs);
        this.statePopulationByAgeGroupEvent.emit(this.statesPopulationByAgeGroups);
        this.populationAsAnObjectEvent.emit(this.populationAsAnObject);

        this.resetGeoMapData(this.geoChartDataStateIdName);
        this.generateDefaultMapOption();
      });
    })()
  }

  private generateDefaultMapOption(): void {
    this.map_ChartOptions = {
      region: 'US',
      displayMode: 'region',
      resolution: 'provinces',
      legend: 'none',
      enableRegionInteractivity: 'true',
      sizeAxis: {minSize: 1, maxSize: 10},
      colorAxis: {minValue: 1000000, maxValue: 32000000, colors: ['#3f51b5']},
      width: '100%',
      aggregationTarget: 'category',
      defaultColor: '#f5f5f5',
    };
    this.renderMap();
  }

  public setGeoMapToPopulationData() {
    this.map_ChartData = [['State', 'Population'], ...(this.statesTotalPopulationByName)];
    this.map_ChartOptions['colorAxis'] = {minValue: 1000000, maxValue: 32000000, colors: ['#3f51b5']};
    this.renderMap();
  }

  public setGeoMapToUnemploymentData() {
    this.map_ChartData = [['State', 'Unemployment'], ...(this.unemploymentGeoMapData)];
    this.map_ChartOptions['colorAxis'] = {minValue: 2, maxValue: 7, colors: ['#B71C1C']};
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
    await new Promise<void>(resolve => {
      this.usInfographicsService.getunemploymentData().subscribe(data => {
        this.unemploymentData = data;
        resolve();
      });
    });
  }

  private static getAllStatesTotalPopulation(statesPopulations): any[] {
    let allStatePopulations: any = {};
    for (let statePopulation of statesPopulations) {
      let currentState: string = statePopulation['State'];
      let stateName = statePopulation['State'];
      statePopulation['State'] = 0;
      allStatePopulations[currentState] = this.sumObjectProperties(statePopulation);
      statePopulation['State'] = stateName;
    }
    return allStatePopulations;
  }

  private mapStateNameWithPopulation(statesPopulations, statesNamesMapping): any[] {
    let statesNamesAndPopulations = [];
    for (let stateName in statesNamesMapping) {
      let stateFullName = statesNamesMapping[stateName]
      let stateTotalPopulation = statesPopulations[stateName];
      if (typeof statesPopulations[stateName] === 'undefined') {
        continue;
      }
      statesNamesAndPopulations.push([stateFullName, stateTotalPopulation]);
    }
    return statesNamesAndPopulations;
  }

  private mapStateNamePopulationStateCode(statesPopulations, statesNamesMapping): any[] {
    let statesNamesAndPopulations = [];
    for (let stateId in statesNamesMapping) {
      let stateFullName = statesNamesMapping[stateId]
      let stateTotalPopulation = statesPopulations[stateId];
      if (typeof  statesPopulations[stateId] === 'undefined') {
        continue;
      }
      statesNamesAndPopulations.push({
        'name': stateFullName,
        'population': stateTotalPopulation,
        'id': stateId.toLowerCase(),
      });
    }
    return statesNamesAndPopulations;
  }


  public static sumObjectProperties(obj): number {
    return Object.keys(obj)
      .reduce(function (sum, key) {
        return sum + parseFloat(obj[key]);
      }, 0);
  }


  updateTab(event: number) {
    this.currentTab = event;
    this.setSelectedStateId(null);
    switch (event) {
      case 0: { //Overview
        this.resetGeoMapData(this.geoChartDataStateIdName);
        this.generateDefaultMapOption();
        break;
      }
      case 1: { //Population
        this.generateDefaultMapOption();
        this.setGeoMapToPopulationData();
        break;
      }
      case 2: { //Jobs
        this.generateDefaultMapOption();
        this.setGeoMapToUnemploymentData();
        break;
      }

    }
  }

  stateSelected(stateId) {
    stateId = stateId.toUpperCase();
    this.setSelectedStateId(stateId);
    this.hightlightSelectedState(stateId);
    this.zoomInState(stateId);
  }

  private hightlightSelectedState(stateId) {
    this.map_ChartData = [['State', 'Population'], ['US-' + stateId, this.populationAsAnObject[stateId]]];
    this.map_ChartOptions['colorAxis'] = {
      minValue: 1,
      maxValue: this.populationAsAnObject[stateId],
      colors: ['#3f51b5']
    }
    this.renderMap();
  }

  public zoomInState(stateId: string): void {
    this.map_ChartOptions['region'] = 'US-' + stateId;
    this.renderMap();
  }

  public refresh(): void {
    this.updateTab(this.currentTab);
  }

  private setSelectedStateId(stateId: string): void {
    this.selectedStateId = stateId;
    this.selectedStateEvent.emit(this.selectedStateId);
  }

  public static objectToArray(obj: any): any[] {
    return Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });
  }

  private static createStateCodeNameMappingToStateCode(obj: any): any {
    let result = {};
    for (let key in obj) {
      result[obj[key]] = key;
      result[key] = key;
    }
    return result;
  }

  private renderMap(): void {
    this.updateGeoMap = !this.updateGeoMap;
  }
}
