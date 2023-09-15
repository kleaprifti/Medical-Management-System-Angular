import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from './appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/appointments';
  constructor(private http: HttpClient) { }
  getAppointments(doctorId: number | null, patientId: number | null, selectedDate?: Date): Observable<Appointment[]> {
    let params = new HttpParams();

    if (doctorId !== null) {
      params = params.append('doctorId', doctorId.toString());
    }

    if (patientId !== null) {
      params = params.append('patientId', patientId.toString());
    }

    if (selectedDate) {
      params = params.append('selectedDate', selectedDate.toISOString());
    }

    return this.http.get<Appointment[]>(`${this.apiUrl}`, { params });
  }
  
getAllAppointments(doctorId: number | null, patientId: number | null,startDateTime: string | undefined, endDateTime: string | undefined): Observable<Appointment[]> {
    let params = new HttpParams();

    if (doctorId !== null) {
      params = params.append('doctorId', doctorId.toString());
    }
    if (patientId !== null) {
      params = params.append('doctorId', patientId.toString());
    }

    if (startDateTime !== undefined && endDateTime !== undefined) {
      params = params.append('startDateTime', startDateTime);
      params = params.append('endDateTime', endDateTime);
    }

    const url = `${this.apiUrl}/appointments`;
    return this.http.get<Appointment[]>(url, { params: params });
  }
  
  deleteAppointment(appointmentId: number, wantNotification: boolean): Observable<void> {
    const url = `${this.apiUrl}/${appointmentId}?wantNotification=${wantNotification}`;
    return this.http.delete<void>(url);
}

addAppointment(appointmentDto: {
  doctorId: number | null,
  patientId: number | null,
  startDateTime: Date
  endDateTime: Date

}): Observable<Appointment[]> {
  const startDateTime = appointmentDto.startDateTime.toISOString();
  const endDateTime = appointmentDto.endDateTime.toISOString();

  const body = {
    doctorId: appointmentDto.doctorId,
    patientId: appointmentDto.patientId,
    appointmentDateStartTime: startDateTime,
    appointmentDateEndTime: endDateTime,
  };
  
  return this.http.post<Appointment[]>(`${this.apiUrl}/addAppointment`, body);
}


findConflictingAppointments(
  patientId: number,
  doctorId: number,
  startDateTime: string,
  endDateTime: string
): Observable<Appointment[]> {
  const params = {
    patientId: patientId.toString(),
    doctorId: doctorId.toString(),
    startDateTime,
    endDateTime,
  };

  return this.http.get<Appointment[]>(
    `${this.apiUrl}/findConflictingAppointments`,
    { params }
  );
}

}