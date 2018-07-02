import {Component, OnInit} from '@angular/core';
import {GeomapComponent} from "../geomap/geomap.component";
import {State} from "../../models/state";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public currentState: State;
  private stateCodeToNameMapping: object;

  private allStatesPopulationChartData: any[][];
  private allStatesJobsChartData: any[][];

  private populationStateCodeMapping: object;

  constructor() {
  }

  ngOnInit() {

  }

  public currentJobsChartData = [
    ['Job', '%'],
    ["agriculture", 60.0],
    ["manufacturing", 0.0],
    ["mining", 2.0],
    ["trade", 30.0],
    ["domestic service", 0.0],
    ["professional service", 10.0]
  ];

  public currentPopulationChartData = [
    ["Population by age groups", "Population"],
    ["Under 5 Years", 148323],
    ["5 to 13 Years", 241326],
    ["14 to 17 Years", 112801],
    ["18 to 24 Years", 203097],
    ["25 to 44 Years", 517154],
    ["45 to 64 Years", 501604],
    ["65 Years and Over", 260051],
  ];

  private createPopulationDataForState(stateId): void {
    this.currentPopulationChartData = [["Population by age groups", "Population"], ...(this.allStatesPopulationChartData[stateId])];
  }

  private createJobDataForState(stateId): void {
    this.currentJobsChartData = [['Job', '%'], ...(this.allStatesJobsChartData[stateId])];
  }

  public barChartOptions = {
    title: 'Population by age groups',
    legend: {position: 'none'},
    colors: ['green', 'blue'],
  };

  public pichartoptions = {
    title: 'State Jobs',
    pieHole: 0.3,
  };

  public stateSelected(stateId: string) {
    if(stateId === null){
      this.currentState = null;
      return;
    }
    this.generateChartDatas(stateId);
    this.currentState = {
      name: this.stateCodeToNameMapping[stateId],
      id: stateId.toLowerCase(),
      population: this.populationStateCodeMapping[stateId],
      area: 423970,
    };
  }

  private generateChartDatas(stateId: string): void {
    this.createPopulationDataForState(stateId);
    //this.createJobDataForState(stateId);
  }

  public setStateJobs(stateJobs): void {
    this.allStatesJobsChartData = this.generateJobsChartData(stateJobs);
  }

  public setStatePopulationByAgeGroup(statePopulationByAgeGroup): void {
    this.allStatesPopulationChartData = this.generatePopulationChartData(statePopulationByAgeGroup);
  }

  public setStateCodeToNameMapping(nameMapping): void {
    this.stateCodeToNameMapping = nameMapping;
  }

  public setPopulationStateCodeMapping(populationStateCodeMapping) {
    this.populationStateCodeMapping = populationStateCodeMapping;
  }

  private generatePopulationChartData(ageGroupPopulation): any[][] {
    console.log(ageGroupPopulation);
    ageGroupPopulation = this.populationObjectToArray(ageGroupPopulation);
    console.log(ageGroupPopulation);
    return ageGroupPopulation;
  }

  public populationObjectToArray(obj: any): object {
    let nestedObject = Object.keys(obj).map(function (key) {
      let objectArray = (GeomapComponent.objectToArray(obj[key]));
      objectArray.shift();
      return {[obj[key]['State']]: objectArray};
    });
    return this.arrayToObject(nestedObject);
  }

  public arrayToObject(array) {
    let resultObject = {};
    for (let i = 0; i < array.length; ++i) {
      let objectName = Object.keys(array[i])[0];
      let objectValue = array[i][objectName];
      resultObject[objectName] = objectValue;
    }
    return resultObject;
  }

  private generateJobsChartData(jobsData): any[][] {
    return [];
  }
}
