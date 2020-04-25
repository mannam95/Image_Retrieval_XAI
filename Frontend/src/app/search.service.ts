import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchModel } from './search.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchResultModel } from './search.result.model';


@Injectable()
export class SearchService{


  searchURL = "http://localhost:3000/api/search/lireq";

  private serchResultReceived = new Subject<SearchResultModel[]>();

  constructor(private http:HttpClient){}


  searchResultListener()
  {
    return this.serchResultReceived.asObservable();
  }

  searchResult(searchData:SearchModel)
  {
    const formData = new FormData();
    formData.append('url', searchData.url);

    this.http.post<{responseHeader:object, response:{docs:SearchResultModel[]}}>(this.searchURL, formData).subscribe(
      (res) => {console.log(res.response.docs); this.serchResultReceived.next(res.response.docs)},
      (err) => console.log(err)
    );
  }
}
