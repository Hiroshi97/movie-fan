import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { User } from '../../model/user';
import { UserInfo } from '../../model/user-info';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userInfo: UserInfo;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUserInfo().subscribe(userInfo => {this.userInfo = userInfo});
  }

  getFlag(code: string): string {
    const flagURL = "https://www.countryflags.io/" + code + "/flat/24.png";
    return flagURL;
  }

}
