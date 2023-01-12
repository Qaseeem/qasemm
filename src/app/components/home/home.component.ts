import { HotToastService } from '@ngneat/hot-toast';
import { Soru } from 'src/app/models/Soru';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  mevcutAnketler: Soru[] = [];
  eskiAnketler: Soru[] = [];
  frm: FormGroup = new FormGroup({
    baslik: new FormControl(),
    aciklama: new FormControl(),
    anketadi: new FormControl(),
    soru1: new FormControl(),
    soru2: new FormControl(),
    soru3: new FormControl(),
    soru4: new FormControl(),
    soru5: new FormControl(),
    tamam: new FormControl()
  });
  constructor(
    public fbservis: FbservisService,
    public htoast: HotToastService
  ) { }

  ngOnInit() {

    this.AnketListele();
    this.fbservis.aktifUye.subscribe(d => {
      console.log(d);
    });

  }
  AnketListele() {
    this.fbservis.AnketListele().subscribe(d => {
      this.mevcutAnketler = d.filter(s => s.tamam == false || s.tamam == null);
      this.eskiAnketler = d.filter(s => s.tamam == true);
    });
  }
  AnketKaydet() {
    // console.log(this.frm.value);
    this.fbservis.AnketEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Anket Eklendi',
          loading: 'Anket Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
  }
  AnketSil(Soru: Soru) {
    this.fbservis.AnketSil(Soru).then(() => {
    });
  }
  AnketTamamIptal(Soru: Soru, d: boolean) {
    Soru.tamam = d;
    this.fbservis.AnketDuzenle(Soru).then(() => {

    });
  }











}
