import { type AuthSession, type User, createClient } from "@supabase/supabase-js";
import { createSignal, onMount } from "solid-js";

const requestUrl = new URL(location.href);

const supabase = createClient(
    "https://kzqpqtqdmhjmabwsvlts.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cXBxdHFkbWhqbWFid3N2bHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwMTcwNzUsImV4cCI6MjAzMjU5MzA3NX0.aZ-f4rlHMapYuFk3C_92KZnOyxSbGGIgr0bCm5MdV_w",
);

async function tryLogin(searchParams: URLSearchParams) {
    const accessToken = searchParams.get("access_token");
    if (!accessToken) {
        return;
    }

    const refreshToken = searchParams.get("refresh_token");
    if (!refreshToken) {
        return;
    }

    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
}

if (requestUrl.hash) {
    const url = new URL(requestUrl.origin + requestUrl.pathname + requestUrl.hash.replace(/^#/, "?"));
    tryLogin(url.searchParams);
}
tryLogin(requestUrl.searchParams);

export function SupabaseLogin() {
    const [getUser, setUser] = createSignal<User | null>(null);

    onMount(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        supabase.auth.onAuthStateChange((_event, session: AuthSession | null) => {
            setUser(session?.user ?? null);
        });
    });

    return (
        <div class="fixed top-2 right-2 block" id="login">
            {getUser() !== null ? (
                <img
                    src={getUserAvatar(getUser()!)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    class="pointer-events-none aspect-square h-8 w-8 rounded-md"
                />
            ) : null}
        </div>
    );
}

function getUserAvatar(user: User): string {
    return user.user_metadata.avatar_url || user.user_metadata.picture || "";
}
