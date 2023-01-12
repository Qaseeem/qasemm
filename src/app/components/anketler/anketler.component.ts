import { HotToastService } from '@ngneat/hot-toast';
import { FbservisService } from './../../services/fbservis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Soru } from 'src/app/models/Soru';
import { firestoreInstance$ } from '@angular/fire/firestore';
import { Cevap } from 'src/app/models/Cevap';

@Component({
  selector: 'app-anketler',
  templateUrl: './anketler.component.html',
  styleUrls: ['./anketler.component.css']
})
export class AnketlerComponent implements OnInit {
  anketler!: Soru[];
  mevcutAnketCevap: Soru[] = [];
  eskiAnketCevap: Soru[] = [];
  frm: FormGroup = new FormGroup({
    cevapadi: new FormControl(),
    soru1Cevap: new FormControl(),
    soru2Cevap: new FormControl(),
    soru3Cevap: new FormControl(),
    soru4Cevap: new FormControl(),
    soru5Cevap: new FormControl(),
    tamam: new FormControl()
  });
  constructor(
    public fbservis: FbservisService,
    public htoast: HotToastService
  ) { }

  ngOnInit() {
    this.AnketListele();
    console.log(this.anketler)
    this.AnketCevapListele();
    this.fbservis.aktifUye.subscribe(d => {
      console.log(d);
    });

  }
  AnketListele() {
    this.fbservis.AnketListele().subscribe(d => {
      this.anketler = d;
    })
  }
  AnketCevapListele() {
    this.fbservis.AnketListele().subscribe(d => {
      this.mevcutAnketCevap = d.filter(s => s.tamam == false || s.tamam == null);
      this.eskiAnketCevap = d.filter(s => s.tamam == true);
    });
  }
  Kaydet() {
    // console.log(this.frm.value);
    this.fbservis.AnketCevapEkle(this.frm.value)
      .pipe(
        this.htoast.observe({
          success: 'Görev Eklendi',
          loading: 'Görev Ekleniyor...',
          error: ({ message }) => `${message}`
        })
      )
      .subscribe();
  }
  Sil(Cevap: Cevap) {
    this.fbservis.AnketCevapSil(Cevap).then(() => {

    });
  }
  TamamIptal(Cevap: Cevap, d: boolean) {
    Cevap.tamam = d;
    this.fbservis.AnketCevapDuzenle(Cevap).then(() => {

    });
  }


}