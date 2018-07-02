import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleChartDirective } from './google-chart.component';

describe('GoogleChartDirective', () => {
  let component: GoogleChartDirective;
  let fixture: ComponentFixture<GoogleChartDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleChartDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleChartDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
