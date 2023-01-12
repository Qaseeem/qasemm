import { Uye } from './../models/Uye';
import { Soru } from '../models/Soru';
import { Cevap } from '../models/Cevap';
import { Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, docData, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { concatMap, from, map, Observable, of, switchMap, take } from 'rxjs';
import { addDoc, updateDoc } from '@firebase/firestore';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  User,
  UserInfo,
} from '@angular/fire/auth';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FbservisService {
  aktifUye = authState(this.auth);
  constructor(
    public fs: Firestore,
    public auth: Auth,
    public storage: Storage
  ) { }

  KayitOl(mail: string, parola: string) {
    return from(createUserWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumAc(mail: string, parola: string) {
    return from(signInWithEmailAndPassword(this.auth, mail, parola));
  }
  OturumKapat() {
    return from(this.auth.signOut());
  }
  GoogleSignUp() {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider))
  }
  get AktifUyeBilgi() {
    return this.aktifUye.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.fs, 'Uyeler', user?.uid);
        return docData(ref) as Observable<Uye>;
      })
    );
  }

  UyeListele() {
    var ref = collection(this.fs, "Uyeler");
    return collectionData(ref, { idField: 'uid' }) as Observable<Uye[]>;
  }
  UyeEkle(uye: Uye) {
    var ref = doc(this.fs, 'Uyeler', uye.uid);
    return from(setDoc(ref, uye));
  }
  UyeDuzenle(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return from(updateDoc(ref, { ...uye }));
  }
  UyeSil(uye: Uye) {
    var ref = doc(this.fs, "Uyeler", uye.uid);
    return deleteDoc(ref);
  }

  uploadImage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }







  AnketCevapListele() {
    var ref = collection(this.fs, "AnketlerCevap");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('uid', '==', user?.uid)
        );
        return collectionData(myQuery, { idField: 'cevapId' }) as Observable<Cevap[]>;
      })
    );
  }
  AnketCevapEkle(Cevap: Cevap) {
    var ref = collection(this.fs, "AnketlerCevap");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          anketadı: Cevap.cevapadi,
          soru1Cevap: Cevap.soru1Cevap,
          soru2Cevap: Cevap.soru2Cevap,
          soru3Cevap: Cevap.soru3Cevap,
          soru4Cevap: Cevap.soru4Cevap,
          soru5Cevap: Cevap.soru5Cevap,
          tamam: Cevap.tamam,
          uid: user?.uid
        })
      ),
      map((ref) => ref.id)
    );
  }
  AnketCevapDuzenle(Cevap: Cevap) {
    var ref = doc(this.fs, "AnketlerCevap/" + Cevap.cevapadi);
    return updateDoc(ref, { ...Cevap });
  }
  AnketCevapSil(Cevap: Cevap) {
    var ref = doc(this.fs, "AnketlerCevap/" + Cevap.cevapadi);
    return deleteDoc(ref);
  }





  AnketListele() {
    var ref = collection(this.fs, "Anketler");
    return this.aktifUye.pipe(
      concatMap((user) => {
        const myQuery = query(
          ref,
          where('uid', '==', user?.uid)
        );
        return collectionData(myQuery, { idField: 'anketId' }) as Observable<Soru[]>;
      })
    );
  }
  AnketEkle(Soru: Soru) {
    var ref = collection(this.fs, "Anketler");
    return this.aktifUye.pipe(
      take(1),
      concatMap((user) =>
        addDoc(ref, {
          anketadi: Soru.anketadi,
          soru1: Soru.soru1,
          soru2: Soru.soru2,
          soru3: Soru.soru3,
          soru4: Soru.soru4,
          soru5: Soru.soru5,
          tamam: Soru.tamam,
          uid: user?.uid
        })
      ),
      map((ref) => ref.id)
    );
  }
  AnketDuzenle(Soru: Soru) {
    var ref = doc(this.fs, "Anketler/" + Soru.anketadi);
    return updateDoc(ref, { ...Soru });
  }
  AnketSil(Soru: Soru) {
    var ref = doc(this.fs, "Anketler/" + Soru.anketadi);
    return deleteDoc(ref);
  }

}
