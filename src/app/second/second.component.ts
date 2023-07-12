import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { Appointment } from '../appointment';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-second',
  templateUrl: './second.component.html',
  styleUrls: ['./second.component.css']
})
export class SecondComponent implements OnInit {
  doctors: User[] = [];
  appointments: Appointment[] = [];
  selectedDoctorId: number | null = null;
  isPatientSortedAscending: boolean = true;
  isDateSortedAscending: boolean = false;
  patientSortOrder: 'asc' | 'desc' = 'asc';
  appointmentSortOrder: 'asc' | 'desc' = 'desc';
  isDoctorSelected: boolean = false;
  selectedDate: Date = new Date();

  constructor(private userService: UserService, private appointmentService: AppointmentService) {}

  ngOnInit() {
    this.userService.getDoctors().subscribe(users => {
      this.doctors = users;
      console.log('Doctors:', this.doctors);
    });
    this.loadAppointments();
  }

  onDoctorSelection() {
    console.log('Selected doctor ID:', this.selectedDoctorId);
    if (this.selectedDoctorId !== null) {
      this.isDoctorSelected = true;
      this.loadAppointments();
    } else {
      this.appointments = [];
    }
  }

  loadAppointments() {
    console.log('Loading appointments...');
    
    if (this.selectedDoctorId !== null) {
      let startDateTime: string | undefined;
      let endDateTime: string | undefined;
  
      // Set startDateTime and endDateTime based on the selected date
      if (this.selectedDate) {
        const start = new Date(this.selectedDate);
        start.setHours(0, 0, 0, 0);
        startDateTime = start.toISOString();
  
        const end = new Date(this.selectedDate);
        end.setHours(23, 59, 59, 999);
        endDateTime = end.toISOString();
      }
  
      this.appointmentService.getAppointments(this.selectedDoctorId, startDateTime, endDateTime).subscribe(
        appointments => {
          if (appointments.length === 0) {
            this.appointments = [];
          } else {
            this.appointments = appointments;
            this.sortAppointmentsByDate();
            this.sortAppointmentsByPatient();
          }
  
          console.log(this.appointments);
        },
        error => {
          console.log('Error occurred while loading appointments:', error);
          this.appointments = []; // Reset appointments to an empty array on error
        }
      );
    } else {
      this.appointments = []; // Reset appointments to an empty array when no doctor is selected
    }
  }
  
  


  onDateSelection() {
    console.log('Selected date:', this.selectedDate);
    if (!this.selectedDate) {
      this.selectedDate = new Date(); // Set selectedDate to current date
    }
    this.loadAppointments();
  }

  sortAppointmentsByPatient() {
    this.isPatientSortedAscending = !this.isPatientSortedAscending;
    this.appointments.sort((a, b) => {
      const nameA = a.patientFullName.toLowerCase();
      const nameB = b.patientFullName.toLowerCase();

      if (this.isPatientSortedAscending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }

  sortAppointmentsByDate() {
    this.isDateSortedAscending = !this.isDateSortedAscending;
    this.appointments.sort((a, b) =>
      this.isDateSortedAscending
        ? new Date(a.appointmentDateStartTime).getTime() - new Date(b.appointmentDateStartTime).getTime()
        : new Date(b.appointmentDateStartTime).getTime() - new Date(a.appointmentDateStartTime).getTime()
    );
  }

  togglePatientSortOrder() {
    this.patientSortOrder = this.patientSortOrder === 'asc' ? 'desc' : 'asc';
    this.sortAppointmentsByPatient();
  }

  toggleAppointmentSortOrder() {
    this.appointmentSortOrder = this.appointmentSortOrder === 'asc' ? 'desc' : 'asc';
    this.sortAppointmentsByDate();
  }
}
