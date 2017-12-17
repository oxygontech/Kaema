import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonitorPage } from './monitor';

@NgModule({
  declarations: [
    MonitorPage,
  ],
  imports: [
    IonicPageModule.forChild(MonitorPage),
  ],
})
export class MonitorPageModule {}
