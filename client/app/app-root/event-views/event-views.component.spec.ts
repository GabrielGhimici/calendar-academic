import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventViewsComponent } from './event-views.component';

describe('EventViewsComponent', () => {
  let component: EventViewsComponent;
  let fixture: ComponentFixture<EventViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
