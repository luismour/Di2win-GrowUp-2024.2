import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaulLoginLayoutComponent } from './defaul-login-layout.component';

describe('DefaulLoginLayoutComponent', () => {
  let component: DefaulLoginLayoutComponent;
  let fixture: ComponentFixture<DefaulLoginLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaulLoginLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaulLoginLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
