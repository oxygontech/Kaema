import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Page1 } from './page1';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../../test-config/mocks-ionic';

describe('Page1', () => {
  let de: DebugElement;
  let comp;
  let fixture: ComponentFixture<Page1>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Page1],
      imports: [
        IonicModule.forRoot(Page1)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Page1);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('h3'));
    
  });

  /*it('should create component', () => expect(comp).toBeDefined());

  it('should have expected <h3> text', () => {
    fixture.detectChanges();
    const h3 = de.nativeElement;
    expect(h3.innerText).toMatch(/ionic/i,
      '<h3> should say something about "Ionic"');
  });

  it('should show the favicon as <img>', () => {
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(img.src).toContain('assets/icon/favicon.ico');
  });*/


  it('Add 2 Numbers 1', () => {
    console.log(comp);
   let result=comp.addNumbers(1,2)
    expect(result).toBe(3);
  });

 it('Add 2 Numbers 2', () => {
    
   let result=comp.addNumbers(45,2)
    expect(result).toBe(47);
  });

  it('Add 2 Numbers 3', () => {
    
   let result=comp.addNumbers(45,5)
    expect(result).toBe(50);
  });

});
