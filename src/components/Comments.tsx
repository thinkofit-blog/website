import { createClient } from "@supabase/supabase-js"
import type { AuthSession, User } from "@supabase/supabase-js"
import { createSignal, onMount } from "solid-js"

const requestUrl = new URL(location.href)

const supabase = createClient(
    "https://kzqpqtqdmhjmabwsvlts.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cXBxdHFkbWhqbWFid3N2bHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwMTcwNzUsImV4cCI6MjAzMjU5MzA3NX0.aZ-f4rlHMapYuFk3C_92KZnOyxSbGGIgr0bCm5MdV_w",
)

;(globalThis as any).supabase = supabase

async function tryLogin(searchParams: URLSearchParams) {
    const access_token = searchParams.get("access_token")
    if (!access_token) return

    const refresh_token = searchParams.get("refresh_token")
    if (!refresh_token) return

    await supabase.auth.setSession({ access_token, refresh_token })
}

if (requestUrl.hash) {
    const url = new URL(requestUrl.origin + requestUrl.pathname + requestUrl.hash.replace(/^#/, "?"))
    tryLogin(url.searchParams)
}
tryLogin(requestUrl.searchParams)

function signInWith(provider: "github" | "google") {
    return async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: requestUrl.origin + requestUrl.pathname,
            },
        })
        if (error) {
            throw error
        }
    }
}

const signInWithGithub = signInWith("github")

export const Comments = () => {
    const [user, setUser] = createSignal<User | null>(null)

    onMount(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        supabase.auth.onAuthStateChange((_event, session: AuthSession | null) => {
            setUser(session?.user ?? null)
        })
    })

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) console.error("Error logging out:", error.message)
    }

    return (
        <div>
            {user() ? (
                <div>
                    {user()!.user_metadata?.avatar_url && (
                        <img src={user()!.user_metadata.avatar_url} alt="" width="50" />
                    )}
                    <p>
                        {user()!.user_metadata?.preferred_username ||
                            user()!.user_metadata?.name ||
                            user()!.user_metadata?.user_name ||
                            user()!.user_metadata?.email ||
                            user()!.user_metadata?.full_name ||
                            user()!.email}
                    </p>
                    <button onClick={signOut}>Sign Out</button>
                </div>
            ) : (
                <ul>
                    <li>
                        <button onClick={signInWithGithub}>Login with GitHub</button>
                    </li>
                </ul>
            )}
        </div>
    )
}
