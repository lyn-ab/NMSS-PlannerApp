import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientServicesPage } from './patient-services.page';

const routes: Routes = [
  {
    path: '',
    component: PatientServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientServicesPageRoutingModule {}
