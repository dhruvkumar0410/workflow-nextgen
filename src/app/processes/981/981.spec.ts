import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Process981 } from './981';

describe('Process981', () => {
  let component: Process981;
  let fixture: ComponentFixture<Process981>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Process981]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Process981);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
