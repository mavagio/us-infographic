import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {State} from "../../models/state";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input('statesList') public statesList: State[] = [];

  @Output('selectedRegionEvent') public selectedRegionEvent = new EventEmitter<string>();

  public stateCtrl = new FormControl();
  public filteredStates: Observable<State[]>;

  ngOnInit() {
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this._filterStates(state) : this.statesList.slice())
      );
  }

  public stateClicked(selectedState: State): void {
    this.selectedRegionEvent.emit(selectedState.id);
  }

  constructor() {

  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.statesList.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
