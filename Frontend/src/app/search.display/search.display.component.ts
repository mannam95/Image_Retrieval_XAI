import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchResultModel } from '../search.result.model';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';

@Component({
  selector:'app-search-display',
  templateUrl:'./search.display.component.html',
  styleUrls:['./search.display.component.css']
})
export class SearchDisaplayComponent implements OnInit, OnDestroy{
  searchResult:SearchResultModel []=[];

  constructor(public searchService:SearchService)
  {
  }

  private searchListener:Subscription;

  ngOnInit()
  {
    this.searchListener = this.searchService.searchResultListener().subscribe((results:SearchResultModel[])=>{
      this.searchResult = [...results];
    });
  }

  ngOnDestroy(){
    this.searchListener.unsubscribe();
  }

}
