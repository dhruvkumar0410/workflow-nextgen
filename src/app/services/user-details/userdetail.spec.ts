import { TestBed } from '@angular/core/testing';

import { Userdetail } from './userdetail';

describe('Userdetail', () => {
  let service: Userdetail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Userdetail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
