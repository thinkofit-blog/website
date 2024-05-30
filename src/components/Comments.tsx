import { createClient } from "@supabase/supabase-js"
import type { AuthSession, User } from "@supabase/supabase-js"
import { createSignal, onMount } from "solid-js"

const requestUrl = new URL(location.href)

const supabase = createClient(
    "https://kzqpqtqdmhjmabwsvlts.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cXBxdHFkbWhqbWFid3N2bHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwMTcwNzUsImV4cCI6MjAzMjU5MzA3NX0.aZ-f4rlHMapYuFk3C_92KZnOyxSbGGIgr0bCm5MdV_w",
)

;(globalThis as any).supabase = supabase

type comment = {
    created_at: Date
    user: any
    post: string
    content: string
}

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

function signInWith(provider: "github" | "google" | "linkedin_oidc") {
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
const signInWithLinkedin = signInWith("linkedin_oidc")

export const Comments = () => {
    const [getUser, setUser] = createSignal<User | null>(null)
    const [getComments, setComments] = createSignal<comment[]>([])
    const [getComment, setComment] = createSignal<string>("")

    onMount(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        setUser(user)

        supabase.auth.onAuthStateChange((_event, session: AuthSession | null) => {
            setUser(session?.user ?? null)
        })

        const { data: comments, error: err } = await supabase
            .from("comments")
            .select("created_at, user, post, content")
            .order("created_at", { ascending: false })
            .limit(64)
        if (err) {
            console.error(err)
        }
        if (comments) {
            setComments(comments)
        }
    })

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) console.error("Error logging out:", error.message)
    }

    return (
        <div class="rounded-md border border-ctp-overlay0 p-2">
            {getUser() ? (
                <>
                    <div class="group flex flex-row flex-wrap items-center justify-between gap-2">
                        <img
                            class="block aspect-square h-10 w-10"
                            src={getUser()!.user_metadata.avatar_url ?? getUser()!.user_metadata.picture ?? ""}
                            alt=""
                            width="50"
                            loading="lazy"
                            decoding="async"
                        />
                        <span class="block h-fit text-sm">
                            {getUser()!.user_metadata?.preferred_username ||
                                getUser()!.user_metadata?.name ||
                                getUser()!.user_metadata?.user_name ||
                                getUser()!.user_metadata?.email ||
                                getUser()!.user_metadata?.full_name ||
                                getUser()!.email}
                        </span>
                        <button
                            class="block h-fit rounded-md bg-ctp-red px-2 py-1 text-sm text-ctp-base md:invisible md:group-hover:visible"
                            onClick={signOut}
                        >
                            Abmelden
                        </button>
                    </div>
                    <label class="w-full">
                        Schreibe ein Kommentar
                        <br />
                        <textarea
                            value={getComment()}
                            class="h-24 w-full resize-none rounded-md bg-ctp-crust text-ctp-text"
                            onChange={(x) => {
                                setComment(x.currentTarget.value)
                            }}
                        />
                    </label>
                    <button
                        class="rounded-md bg-ctp-text px-2 py-1 text-ctp-base"
                        onClick={async () => {
                            const resp = await supabase.from("comments").insert({
                                post: location.pathname,
                                content: getComment(),
                            })
                            if (resp.error) {
                                console.error(resp.error)
                                alert(resp.statusText + "\n" + resp.error.message || JSON.stringify(resp.error))
                            } else {
                                setComment("")
                            }
                        }}
                    >
                        Absenden
                    </button>
                </>
            ) : (
                <div>
                    <p>Melde dich an, um einen Kommentar auf diesem Artikel zu hinterlassen.</p>
                    <p>
                        Wir verwenden Cookies, um Anmeldeinformationen zu speichern. Wenn Du dich nicht anmeldest,
                        werden keine Cookies gespeichert. Weitere Informationen findest Du in der{" "}
                        <a href="/privacy-policy" class="text-ctp-text underline hover:text-ctp-mauve">
                            Datenschutzerklärung
                        </a>
                        {"."}
                    </p>
                    <h3>Anmelden mit</h3>
                    <ul class="flex flex-row flex-wrap gap-2">
                        <li>
                            <button class="rounded-md bg-ctp-mauve px-2 py-1 text-ctp-base" onClick={signInWithGithub}>
                                GitHub
                            </button>
                        </li>
                        <li>
                            <button class="rounded-md bg-ctp-blue px-2 py-1 text-ctp-base" onClick={signInWithLinkedin}>
                                LinkedIn
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {getComments().map((comment) => (
                <pre>
                    <code>{JSON.stringify(comment)}</code>
                </pre>
            ))}
        </div>
    )
}
