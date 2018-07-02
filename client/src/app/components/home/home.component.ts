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
  private unemploymentByState: any;

  private populationStateCodeMapping: object;
  public currentPopulationChartData: any;
  public currentJobsChartData: any;

  public barChartOptions: object = {
    title: 'Population by age groups',
    legend: {position: 'none'},
    colors: ['green', 'blue'],
  };

  public pichartoptions: object = {
    title: 'State Jobs',
    pieHole: 0.3,
  };


  constructor(private usInfographicsService: UsInfographicsService) {
  }

  ngOnInit() {
    (async () => {
      await this.loadInfographicsData().then(() => {

      });
    })();
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

  public stateSelected(stateId: string) {
    if (stateId === null) {
      this.currentState = null;
      return;
    }
    this.generateChartDatas(stateId);
    const stateFullName = this.stateCodeToNameMapping[stateId];
    this.currentState = {
      name: stateFullName,
      id: stateId.toLowerCase(),
      population: this.populationStateCodeMapping[stateId],
      area: this.stateArea[stateFullName],
      unemployment: this.unemploymentByState[stateFullName],
    };
  }

  private generateChartDatas(stateId: string): void {
    this.createPopulationDataForState(stateId);
    this.createJobDataForState(stateId);
  }

  public setStateJobs(stateJobs: any): void {
    this.allStatesJobsChartData = this.generateJobsChartData(stateJobs);
  }

  public setStatePopulationByAgeGroup(statePopulationByAgeGroup: any): void {
    this.allStatesPopulationChartData = this.generatePopulationChartData(statePopulationByAgeGroup);
  }

  public setStateCodeToNameMapping(nameMapping: any): void {
    this.stateCodeToNameMapping = nameMapping;
  }

  public setPopulationStateCodeMapping(populationStateCodeMapping: any) {
    this.populationStateCodeMapping = populationStateCodeMapping;
  }

  public setUnemploymentData(uemploymentByState: any) {
    this.unemploymentByState = uemploymentByState;
  }

  private generatePopulationChartData(ageGroupPopulation): any {
    return this.nestedObjectToArray(ageGroupPopulation, 'State');
  }

  private generateJobsChartData(jobsData): any {
    return this.nestedObjectToArray(jobsData, 'name');
  }

  public nestedObjectToArray(obj: any, idName: string): object {
    const nestedObject = Object.keys(obj).map(function (key) {
      const objectArray = (GeomapComponent.objectToArray(obj[key]));
      objectArray.shift();
      return {[obj[key][idName]]: objectArray};
    });
    return this.arrayToObject(nestedObject);
  }

  public arrayToObject(array) {
    const resultObject = {};
    for (let i = 0; i < array.length; ++i) {
      const objectName = Object.keys(array[i])[0];
      const objectValue = array[i][objectName];
      resultObject[objectName] = objectValue;
    }
    return resultObject;
  }
}
