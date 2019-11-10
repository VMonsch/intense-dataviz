import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private firestoreDB: AngularFirestore;
  private queriesCollectionName = '/queries';

  constructor(firestoreDB: AngularFirestore) {
    this.firestoreDB = firestoreDB;
  }

  private getCollection(collectionName: string) {
    return this.firestoreDB.collection(collectionName);
  }

  // region Read

  private getAllFromCollection(collection: AngularFirestoreCollection) {
    return collection.valueChanges();
  }

  getAllQueries() {
    this.getAllFromCollection(this.getCollection(this.queriesCollectionName));
  }

  // endregion

  // region Create

  private createDocument(collectionName: string, document: any) {
    return this.getCollection(collectionName).add(document);
  }

  createQuery(document: any) {
    return this.createDocument(this.queriesCollectionName, document);
  }

  // endregion
}
