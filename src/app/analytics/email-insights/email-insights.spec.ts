import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailInsights } from './email-insights';

describe('EmailInsights', () => {
  let component: EmailInsights;
  let fixture: ComponentFixture<EmailInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailInsights);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
