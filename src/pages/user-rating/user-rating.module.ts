import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRatingPage } from './user-rating';

@NgModule({
  declarations: [
    UserRatingPage,
  ],
  imports: [
    IonicPageModule.forChild(UserRatingPage),
  ],
})
export class UserRatingPageModule {}
