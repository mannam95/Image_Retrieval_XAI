import { Component, OnInit, ɵConsole } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SearchService } from '../search.service';
import { SearchModel } from '../search.model';


@Component({
  selector:'app-search-console',
  templateUrl:'./search.console.component.html',
  styleUrls: ['./search.console.component.css']
})
export class SearchConsoleComponent implements OnInit
{
  submissionURL = "http://localhost:3000/api/search/lireq"

  search:SearchModel;

  fileSelected: File = null;
  imageURL;

  constructor(public searchService:SearchService)
  {
  }

  ngOnInit()
  {
    this.search = {url:null, field:"cl_ha", rows:"60", ms: "false", accuracy: ".33", candidates: "10000"};
  }


  public fileEvent($event) {
    this.fileSelected = $event.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imageURL = reader.result;
    };
    reader.readAsDataURL(this.fileSelected);
  }

  onSearch(formData:NgForm)
  {
    if(formData.invalid || this.fileSelected === null)
    {
      alert('form invalid');
      return;
    }

    this.search = {url:this.fileSelected, field:formData.value.field, rows:formData.value.rows, ms: formData.value.ms, accuracy: formData.value.accuracy, candidates: formData.value.candidates};
    console.log(this.search);
    this.searchService.searchResult({...this.search});
    //this.search = {url:null, field:"cl_ha", rows:"60", ms: "false", accuracy: ".33", candidates: "10000"};
  }

}
