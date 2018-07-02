import {Component, OnInit} from '@angular/core';
import {GeomapComponent} from "../geomap/geomap.component";
import {State} from "../../models/state";
import {UsInfographicsService} from "../../services/us-infographics.service";

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

  private stateArea: any;

  private populationStateCodeMapping: object;
  public currentPopulationChartData: [];
  public currentJobsChartData = [
    ['Job', '%'],
    ["agriculture", 60.0],
    ["manufacturing", 0.0],
    ["mining", 2.0],
    ["trade", 30.0],
    ["domestic service", 0.0],
    ["professional service", 10.0]
  ];


  constructor(private usInfographicsService: UsInfographicsService) {
  }

  ngOnInit() {
    (async () => {
      await this.loadInfographicsData().then(() => {

      });
    })()
  }

  async loadInfographicsData(): Promise<any> {
    await new Promise<void>(resolve => {
      this.usInfographicsService.getAreaData().subscribe(data => {
        this.stateArea = data;
        resolve();
      });
    });
  }

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
    if (stateId === null) {
      this.currentState = null;
      return;
    }
    this.generateChartDatas(stateId);
    this.currentState = {
      name: this.stateCodeToNameMapping[stateId],
      id: stateId.toLowerCase(),
      population: this.populationStateCodeMapping[stateId],
      area: this.stateArea[this.stateCodeToNameMapping[stateId]],
    };
  }

  private generateChartDatas(stateId: string): void {
    this.createPopulationDataForState(stateId);
    this.createJobDataForState(stateId);
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
    return this.nestedObjectToArray(ageGroupPopulation, 'State');
  }

  private generateJobsChartData(jobsData): any[][] {
    return this.nestedObjectToArray(jobsData, 'name')
  }

  public nestedObjectToArray(obj: any, idName: string): object {
    let nestedObject = Object.keys(obj).map(function (key) {
      let objectArray = (GeomapComponent.objectToArray(obj[key]));
      objectArray.shift();
      return {[obj[key][idName]]: objectArray};
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


}
