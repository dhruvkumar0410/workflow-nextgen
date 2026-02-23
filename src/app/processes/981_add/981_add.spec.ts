import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Process981Add } from './981_add';

describe('Process981Add', () => {
  let component: Process981Add;
  let fixture: ComponentFixture<Process981Add>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Process981Add]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Process981Add);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
