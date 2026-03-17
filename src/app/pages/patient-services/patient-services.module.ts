import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatientServicesPageRoutingModule } from './patient-services-routing.module';

import { PatientServicesPage } from './patient-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientServicesPageRoutingModule
  ],
  declarations: [PatientServicesPage]
})
export class PatientServicesPageModule {}
