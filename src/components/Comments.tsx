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
        <div class="rounded-md border border-ctp-overlay0 p-2">
            {user() ? (
                <div class="group flex flex-row flex-wrap items-center justify-between gap-2">
                    {user()!.user_metadata?.avatar_url && (
                        <img
                            class="block aspect-square h-10 w-10"
                            src={user()!.user_metadata.avatar_url}
                            alt=""
                            width="50"
                            loading="lazy"
                            decoding="async"
                        />
                    )}
                    <span class="block h-fit text-sm">
                        {user()!.user_metadata?.preferred_username ||
                            user()!.user_metadata?.name ||
                            user()!.user_metadata?.user_name ||
                            user()!.user_metadata?.email ||
                            user()!.user_metadata?.full_name ||
                            user()!.email}
                    </span>
                    <button
                        class="block h-fit rounded-md bg-ctp-red px-2 py-1 text-sm text-ctp-base md:invisible md:group-hover:visible"
                        onClick={signOut}
                    >
                        Abmelden
                    </button>
                </div>
            ) : (
                <div>
                    <p>Melde dich an, um einen Kommentar auf diesem Artikel zu hinterlassen.</p>
                    <p>
                        Wir verwenden Cookies, um Anmeldeinformationen zu speichern. Wenn Sie sich nicht anmelden,
                        werden keine Cookies gespeichert. Weitere Informationen finden Sie in der{" "}
                        <a href="/privacy-policy" class="text-ctp-text underline hover:text-ctp-mauve">
                            Datenschutzerklärung
                        </a>
                    </p>
                    <h3>Anmelden mit</h3>
                    <ul>
                        <li>
                            <button class="rounded-md bg-ctp-mauve px-2 py-1 text-ctp-base" onClick={signInWithGithub}>
                                GitHub
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
