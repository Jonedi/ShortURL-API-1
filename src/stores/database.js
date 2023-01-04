import { query, collection, getDocs, where, addDoc, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore/lite";
import { defineStore } from "pinia";
import { db, auth } from "../firebase";
import { nanoid } from "nanoid";
import router from "../Router";

export const useDatabseStore = defineStore('database', {
    state: () => ({
        docs: [],
        loadingDoc: false
    }),

    actions: {
        async getUrls() {
            this.loadingDoc = true
            if (this.docs.length !== 0) return 
            try {
                const q = query(collection(db, 'urls'), where("user", "==", auth.currentUser.uid))
                const querySnapshot = await getDocs(q)
                querySnapshot.forEach(doc => {
                    this.docs.push ({
                        id: doc.id,
                        ...doc.data()
                    })
                    // console.log(docs.id, docs.data());
                })
            } catch (e) {
                console.log(e);
            } finally {
                this.loadingDoc = false
            }
        },
        async addUrl(name) {
            this.loadingDoc = true
            try {
                const objDoc = {
                    name,
                    short: nanoid(6),
                    user: auth.currentUser.uid
                }
                const docRef = await addDoc(collection(db, 'urls'), objDoc)
                this.docs.push ({
                    ...objDoc,
                    id: docRef.id
                })
                console.log(objDoc);
            } catch (e) {
                console.log(e.code);
                return e.code
            }finally {
                this.loadingDoc = false
            }
        },
        async leerUrl(id) {
            this.loadingDoc = true
            try {
                const docRef = doc(db, 'urls', id)
                const docSnap = await getDoc(docRef)
                
                if (!docSnap.exists()) {
                    throw new Error('No existe el doc')
                }
                
                if (docSnap.data().user === auth.currentUser.uid) {
                    this.docs = this.docs.filter(i => i.id !== id)
                } else {
                    throw new Error('No es el autor del documento')
                }

                return docSnap.data().name
            } catch (e) {
                console.log(e.message);
            } finally {
                this.loadingDoc = false
            }
        },
        async editUrl(id, name){
            this.loadingDoc = true
            try {
                const docRef = doc(db, 'urls', id)
                const docSnap = await getDoc(docRef)
                
                if (!docSnap.exists()) {
                    throw new Error('No existe el doc')
                }
                
                if (docSnap.data().user === auth.currentUser.uid) {
                    await updateDoc(docRef, { name })
                    this.docs = this.docs.map(i => i.id === id ? {...i, name} : i)
                } else {
                    throw new Error('No es el autor del documento')
                }
                router.push('/')
            } catch (e) {
                console.log(e.message);
                return e.message
            } finally {
                this.loadingDoc = false
            }
        },
        async deleteUrl(id) {
            this.loadingDoc = true
            try {
                const docRef = doc(db, 'urls', id)
                const docSnap = await getDoc(docRef)

                if (!docSnap.exists()) {
                    throw new Error('No existe el doc')
                }

                if (docSnap.data().user === auth.currentUser.uid) {
                    await deleteDoc(docRef)
                    this.docs = this.docs.filter(i => i.id !== id)
                } else {
                    throw new Error('No es el autor del documento')
                }

            } catch (e) {
                // console.log(e.message);
                return e.message
            } finally {
                this.loadingDoc = false
            }
        }
    },

    getters: {}
})