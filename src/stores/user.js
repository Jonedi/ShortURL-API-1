import { defineStore } from "pinia";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useDatabseStore } from "./database";
import { useRouter } from "vue-router";
import router from "../Router";
import { errorPrefix } from "@firebase/util";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: null,
        loadingUser: false,
        loadingSession: false
    }),
    
    actions: {
        async registerUser(email, password){
            this.loadingUser = true
            try {
                const { user } = await createUserWithEmailAndPassword(auth, email, password)
                await sendEmailVerification(auth.currentUser)
                this.userData = { email: user.email, uid: user.uid }
                router.push('/')
            } catch (e) {
                console.log(e);
            } finally {
                this.loadingUser = false
            }
        },
        async updateUser(displayName, imagen) {
            this.loadingUser = true;
            try {
                if (imagen) {
                    const storageRef = ref( storage, `profiles/${this.userData.uid}` );
                    await uploadBytes(storageRef, imagen.originFileObj);
                    const photoURL = await getDownloadURL(storageRef);
                    await updateProfile(auth.currentUser, {
                        photoURL,
                    });
                }
                await updateProfile(auth.currentUser, {
                    displayName,
                });
                this.setUser(auth.currentUser);
            } catch (error) {
                console.log(error);
                return error.code;
            } finally {
                this.loadingUser = false;
            }
        },
        async setUser(user) {
            try {
                const docRef = doc(db, "users", user.uid);

                this.userData = {
                    email: user.email,
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                };

                await setDoc(docRef, this.userData);
            } catch (error) {
                console.log(error);
            }
        },
        async loginUser(email, password){
            this.loadingUser = true
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                
                router.push('/')
            } catch (e) {
                return e.code
            } finally {
                this.loadingUser = false
            }
        },
        async logOutUser() {
            this.loadingUser = true
            const databaseStore = useDatabseStore()
            databaseStore.$reset()
            try {
                router.push('/login')
                await signOut(auth)
            } catch (e) {
                return e.code
            } finally {
                this.loadingUser = false
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unSuscribe = onAuthStateChanged(auth, async user => {
                    if (user) {
                        await this.setUser(user)
                    } else {
                        this.userData = null
                        const databaseStore = useDatabseStore()
                        databaseStore.$reset()
                    }
                    resolve(user)
                }, e => reject(e))
                unSuscribe()
            })
        }
    },

    getters: {  },
})