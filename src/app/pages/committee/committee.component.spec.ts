import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeComponent } from './committee.component';

describe('ConsortiumComponent', () => {
  let component: CommitteeComponent;
  let fixture: ComponentFixture<CommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
