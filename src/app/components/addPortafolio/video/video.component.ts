import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MultimediaServiceService } from '../../../services/multimedia-service.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  data: any = [];
  dataPopular: any = [];

  constructor(private toastr: ToastrService, private service: MultimediaServiceService) { }

  ngOnInit() {
    this.getVideos();
  }

  getVideos(){
    return this.service.getVideos("vdo").subscribe(data => {
      this.data = data;
      //this.getPopularVideos();
    }, (() => {
      this.toastr.error("Hubo un problema, intente mas tarde");
    }));
  }

  getPopularVideos(){
    return this.service.getPoularVideos("vdo").subscribe(data => {
      this.dataPopular = data;
    }, (() => {
      this.toastr.error("Hubo un problema, intente mas tarde");
    }));
  }


}
