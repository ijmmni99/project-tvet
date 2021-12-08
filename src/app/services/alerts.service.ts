import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Alert } from '../models/alert';

@Injectable({
  providedIn: 'root'
})

export class AlertsService {

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  
  constructor(private _snackBar: MatSnackBar) {}

  alerts: Alert[] = [];

  addError(message: string, debug?: string) {
    //this.alerts.push({message: message, debug: debug ?? '', type: 'danger'});
    this._snackBar.open(message, 'Error', {
      verticalPosition: this.verticalPosition,
      duration: 5000,
      panelClass: ['mat-toolbar', 'mat-warn']
    });
  }

  addSuccess(message: string, debug?: string) {
    //this.alerts.push({message: message, debug: debug ?? '', type: 'success'});
    this._snackBar.open(message, 'Success', {
      verticalPosition: this.verticalPosition,
      duration: 5000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  remove(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }
}