import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ListaViajesComponent } from './lista-viajes.component';

describe('ListaViajesComponent', () => {
  let component: ListaViajesComponent;
  let fixture: ComponentFixture<ListaViajesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaViajesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaViajesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});