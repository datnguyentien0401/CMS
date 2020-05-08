import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../app/_services/api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  providers: [ApiService]
})
export class FilterComponent implements OnInit {
  clientIds: string[] = null;

  @Output() clientIdEmmit = new EventEmitter();
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getAllClientId('/oauthClient/getClientIds')
      .subscribe(data => {
        this.clientIds = data as string[];
      });
  }

  selectClientId(clientId): void {
    this.clientIdEmmit.emit(clientId);
  }
}
