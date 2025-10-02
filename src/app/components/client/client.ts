import { ChangeDetectorRef, Component } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { UserService } from '../../services/user.service';
import { User } from '../../Models/User';
import { UserDto } from '../../DTOs/UserDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  imports: [CommonModule],
  templateUrl: './client.html',
  styleUrl: './client.css'
})
export class Client {

  constructor(private clientSvc:UserService,
  private cdRef: ChangeDetectorRef){}

  users: any[] = [];

getAllClients(event?: Event) {
  event?.preventDefault();
  this.clientSvc.getAllUsers().subscribe(
    (data) => {
      this.users = data;
      console.log(this.users);
      this.cdRef.detectChanges();
    },
    (error) => {
      console.error(error);
    }
  );
}
}
