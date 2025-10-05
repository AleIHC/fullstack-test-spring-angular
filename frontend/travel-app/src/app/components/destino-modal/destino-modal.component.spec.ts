import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinoModalComponent } from './destino-modal.component';

describe('DestinoModalComponent', () => {
  let component: DestinoModalComponent;
  let fixture: ComponentFixture<DestinoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
