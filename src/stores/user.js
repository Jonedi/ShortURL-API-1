import { defineStore } from "pinia";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useDatabseStore } from "./database";
import { useRouter } from "vue-router";
import router from "../Router";

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
                this.userData = { email: user.email, uid: user.uid}
                router.push('/')
            } catch (e) {
                console.log(e);
            } finally {
                this.loadingUser = false
            }
        },
        async loginUser(email, password){
            this.loadingUser = true
            const databaseStore = useDatabseStore()
            databaseStore.$reset()
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                this.userData = { email: user.email, uid: user.uid }
                router.push('/')
            } catch (e) {
                return e.code
            } finally {
                this.loadingUser = false
            }
        },
        async logOutUser() {
            this.loadingUser = true
            try {
                await signOut(auth)
                this.userData = null
                router.push('login')
            } catch (e) {
                return e.code
            } finally {
                this.loadingUser = false
            }
        },
        currentUser() {
            return new Promise((resolve, reject) => {
                const unSuscribe = onAuthStateChanged(auth, u => {
                    if (u) {
                        this.userData = { email: u.email, uid: u.uid }
                    } else {
                        this.userData = null
                        const databaseStore = useDatabseStore()
                        databaseStore.$reset()
                    }
                    resolve(u)
                }, e => reject(e))
                unSuscribe()
            })
        }
    },

    getters: {  },
})