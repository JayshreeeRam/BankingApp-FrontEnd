import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-support',
  imports:[FormsModule,CommonModule],
  templateUrl: './support.html',
  styleUrls: ['./support.css']
})
export class Support {
  // Support form model
  support = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

 submitSupportForm() {
  const templateParams = {
    name: this.support.name,       // this will replace {{name}}
    title: this.support.subject,   // this will replace {{title}}
    message: this.support.message,
    email: this.support.email
  };

  emailjs.send('service_z6u6vdn', 'template_lyhpnuk', templateParams, 'J9I5cEgOtasUVmRn2')
    .then((response:any) => {
       console.log('SUCCESS!', response.status, response.text);
       alert('Your support request has been submitted successfully.');
    }, (error:any) => {
       console.log('FAILED...', error);
       alert('Failed to submit your support request.');
    });
}
}