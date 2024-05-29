import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyB-0b4L0WNtHr6hQIzHSaUrWkD-uBloWao",
    authDomain: "think-of-it.firebaseapp.com",
    projectId: "think-of-it",
    storageBucket: "think-of-it.appspot.com",
    messagingSenderId: "243778068084",
    appId: "1:243778068084:web:5b8c9b7ffea1f4ba6e3b21",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

const googleAuth = new GoogleAuthProvider()
const githubAuth = new GithubAuthProvider()

const fb = { app, googleAuth, githubAuth, auth }

export function Comments() {
    if (fb.auth.currentUser) {
        return (
            <>
                <p>User: {fb.auth.currentUser?.displayName ?? "none"}</p>
            </>
        )
    } else {
        return <button onClick={() => signInWithPopup(fb.auth, fb.googleAuth)}>Google</button>
    }
}
