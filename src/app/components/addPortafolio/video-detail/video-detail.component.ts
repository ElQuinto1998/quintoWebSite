import {Component, OnInit} from '@angular/core';
import { MultimediaServiceService } from '../../../services/multimedia-service.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment';

// @ts-ignore
@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.css']
})
export class VideoDetailComponent implements OnInit {

  data: any = {};
  comts: any = false;
  video_id: any;
  private sub: any;
  checkoutForm: any;
  tiempoText: any;
  tiempo: any;

  constructor(private toastr: ToastrService,
              private service: MultimediaServiceService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {

    this.checkoutForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      message: [null, Validators.required]
    });

  }

  ngOnInit() {

    $('#post-commet').hide();
    this.sub = this.route.params.subscribe(params => {
      this.getVideoById(params['id']);
    });

  }

  getVideoById(id_media: string) {

    this.service.getVideoById("vdo", id_media).subscribe(data => {
      this.data = data;
      this.video_id = this.data.file.id_media;
      if (this.data.comments.length > 0) {
        this.comts = true;
      }
    }, (() => {
      this.toastr.error("Hubo un problema, intente mas tarde");
    }));

  }

  comentar(comment: any, id_media) {

    if (this.checkoutForm.valid) {
      this.service.comment(id_media, comment).subscribe(data => {
        // @ts-ignore
        this.toastr.success(data.message, "Ok", {timeOut: 3000});
        this.ressetForm();
        this.getVideoById(id_media);
      });

    } else {
      this.toastr.error("Todos los campos son requeridos", "Ops..", {timeOut: 3000});
      console.log("Es valido: " + this.checkoutForm.valid);
    }

  }

  like() {

    return this.service.likeVideo(this.data.file.id_media).subscribe(data => {
      // @ts-ignore
      $(".likes-count").text(data.likes);
    }, (() => {
      this.toastr.error("Hubo un problema, intente mas tarde", "Ops..", {timeOut: 3000});
    }));

  }

  showCommentFor() {

    let estado = $("#post-commet").is(':visible');
    if (!estado) {
      $('#post-commet').slideToggle();
      $("#btn-comment-form").attr("class", "btn btn-danger mb-3");
    } else {
      $("#btn-comment-form").attr("class", "btn btn-success mb-3");
      $('#post-commet').hide("slow");
    }

  }

  ressetForm() {
    this.checkoutForm.reset();
    $('#post-commet').hide();
  }

  toFecha(date: Date) {

    let datePost = new Date(date);

    let monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    let day = datePost.getDate();
    let monthIndex = datePost.getMonth();
    let year = datePost.getFullYear();

    return day + '/' + monthNames[monthIndex] + '/' + year;

  }

  getDays(fecha: Date){
    let currentDate = moment(new Date());
    let postDate = moment(new Date(fecha));


    let second = currentDate.diff(postDate, 'seconds');
    let minutes = currentDate.diff(postDate, 'minutes');
    let hours = currentDate.diff(postDate, 'hours');
    let days = currentDate.diff(postDate, 'days');
    let months = currentDate.diff(postDate, 'months');
    let years = currentDate.diff(postDate, 'years');

    if(second > 0 && minutes === 0 && hours === 0 && days === 0 && months === 0 && years === 0){
      this.tiempo = second;
      this.tiempoText = "segundos";
    }else if (minutes > 0 && hours === 0 && days === 0 && months === 0 && years === 0){
      this.tiempo = minutes;
      this.tiempoText = "minutos";
    } else if(hours > 0 && days === 0 && months === 0 && years === 0){
      this.tiempo = hours;
      this.tiempoText = "horas";
    }else if(days > 0 && months === 0 && years === 0){
      this.tiempo = days;
      this.tiempoText = "dias";
    }else if(months > 0 && years === 0){
      this.tiempo = months;
      this.tiempoText = "meses";
    }else {
      this.tiempo = years;
      this.tiempoText = "años";
    }

    return this.tiempo;
  }
}
