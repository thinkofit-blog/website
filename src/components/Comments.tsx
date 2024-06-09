import { createClient } from "@supabase/supabase-js";
import type { AuthSession, User } from "@supabase/supabase-js";
import { createSignal, onMount } from "solid-js";
import { MemoText } from "./MemoText";

const requestUrl = new URL(location.href);

const articleId = requestUrl.pathname.split("/").filter(Boolean).pop() || requestUrl.pathname;

const supabase = createClient(
    "https://kzqpqtqdmhjmabwsvlts.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cXBxdHFkbWhqbWFid3N2bHRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwMTcwNzUsImV4cCI6MjAzMjU5MzA3NX0.aZ-f4rlHMapYuFk3C_92KZnOyxSbGGIgr0bCm5MdV_w",
);

const userRegistry = new Map<bigint, { name: string; avatar: string }>();

async function getUserFromReg(userId: bigint) {
    if (!userRegistry.has(userId)) {
        const userResp = await supabase.from("users").select("name, avatar").filter("id", "eq", userId).single();
        if (userResp.error) {
            console.error(userResp.error);
            userRegistry.set(userId, { name: "N/A", avatar: "" });
        } else {
            userRegistry.set(userId, userResp.data);
        }
    }
    return userRegistry.get(userId)!;
}

function getUserName(user: User): string {
    return (
        user.user_metadata?.preferred_username ||
        user.user_metadata?.name ||
        user.user_metadata?.user_name ||
        user.user_metadata?.email ||
        user.user_metadata?.full_name ||
        user.email ||
        "N/A"
    );
}

function getUserAvatar(user: User): string {
    return user.user_metadata.avatar_url || user.user_metadata.picture || "";
}
(globalThis as any).supabase = supabase;

type Comment = {
    created_at: Date;
    userName: string;
    userAvatar: string;
    content: string;
};

async function tryLogin(searchParams: URLSearchParams) {
    const accessToken = searchParams.get("access_token");
    if (!accessToken) return;

    const refreshToken = searchParams.get("refresh_token");
    if (!refreshToken) return;

    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
}

if (requestUrl.hash) {
    const url = new URL(requestUrl.origin + requestUrl.pathname + requestUrl.hash.replace(/^#/, "?"));
    tryLogin(url.searchParams);
}
tryLogin(requestUrl.searchParams);

function signInWith(provider: "github" | "google" | "linkedin_oidc") {
    return async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: requestUrl.origin + requestUrl.pathname,
            },
        });
        if (error) {
            throw error;
        }
    };
}

const signInWithGithub = signInWith("github");
const signInWithLinkedin = signInWith("linkedin_oidc");

export const Comments = () => {
    const [getUser, setUser] = createSignal<User | null>(null);
    const [getComments, setComments] = createSignal<Comment[]>([]);
    const [getComment, setComment] = createSignal<string>("");

    onMount(async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        supabase.auth.onAuthStateChange((_event, session: AuthSession | null) => {
            setUser(session?.user ?? null);
        });

        const { data: comments, error: err } = await supabase
            .from("comments")
            .select("created_at, user, post, content")
            .filter("post", "eq", articleId)
            .order("created_at", { ascending: false })
            .limit(64);
        if (err) {
            console.error(err);
        }
        if (comments) {
            setComments(
                await Promise.all(
                    comments.map(async (x) => {
                        const u = await getUserFromReg(x.user);
                        return {
                            created_at: x.created_at,
                            userName: u.name,
                            userAvatar: u.avatar,
                            content: x.content,
                        };
                    }),
                ),
            );
        }
    });

    async function onClickSend() {
        // ensure user exists
        const userResp = await supabase.from("users").upsert(
            {
                user_id: getUser()!.id,
                name: getUserName(getUser()!),
                avatar: getUserAvatar(getUser()!),
            },
            { onConflict: "user_id" },
        );
        if (userResp.error) {
            console.error(userResp.error);
            alert(`${userResp.statusText}\n${userResp.error.message}` || JSON.stringify(userResp.error));
            return;
        }

        // get user
        const userSelectResp = await supabase
            .from("users")
            .select("id, name, avatar")
            .filter("user_id", "eq", getUser()!.id)
            .single();

        if (userSelectResp.error) {
            console.error(userSelectResp.error);
            alert(
                `${userSelectResp.statusText}\n${userSelectResp.error.message}` || JSON.stringify(userSelectResp.error),
            );
            return;
        }

        // store user in registry
        userRegistry.set(userSelectResp.data.id, {
            name: userSelectResp.data.name,
            avatar: userSelectResp.data.avatar,
        });

        // create comment
        const commentContent = getComment()
            .trim()
            .replace(/\r/g, "")
            .replace(/[\v\t]/g, " ")
            .replace(/\n{3,}/g, "\n\n");
        const commentResp = await supabase.from("comments").insert({
            user_id: getUser()!.id,
            post: articleId,
            content: commentContent,
            user: userSelectResp.data.id,
        });
        if (commentResp.error) {
            console.error(commentResp.error);
            alert(`${commentResp.statusText}\n${commentResp.error.message}` || JSON.stringify(commentResp.error));
            return;
        }

        // add comment to local list
        setComments([
            {
                created_at: new Date(),
                userName: getUserName(getUser()!),
                userAvatar: getUserAvatar(getUser()!),
                content: commentContent,
            },
            ...getComments(),
        ]);

        // clear comment
        setComment("");
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
        }
    }

    return (
        <div>
            {getUser() ? (
                <div class="print:hidden">
                    <div class="group flex flex-row flex-wrap items-center justify-between gap-2">
                        <ProfileImage src={getUserAvatar(getUser()!)} />
                        <span class="block h-fit text-sm">{getUserName(getUser()!)}</span>
                        <button
                            type="submit"
                            class="block h-fit rounded-md bg-ctp-red px-2 py-1 text-ctp-base text-sm md:group-hover:visible md:invisible"
                            onClick={signOut}
                        >
                            Abmelden
                        </button>
                    </div>
                    <label class="w-full">
                        <p class="my-2">
                            Schreibe ein Kommentar {getComment() ? `(${getComment().length}/280)` : null}
                        </p>
                        <MemoText
                            key={window.location.pathname}
                            value={[getComment, setComment]}
                            class="h-24 w-full resize-none rounded-md bg-ctp-crust px-2 py-1 text-ctp-text"
                            maxLength={280}
                        />
                    </label>
                    <button
                        type="submit"
                        class="ml-auto block rounded-md bg-ctp-text px-2 py-1 text-ctp-base"
                        disabled={getComment().length === 0}
                        onClick={onClickSend}
                    >
                        Absenden
                    </button>
                </div>
            ) : (
                <div class="print:hidden">
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
                            <button
                                type="button"
                                class="rounded-md bg-ctp-mauve px-2 py-1 text-ctp-base"
                                onClick={signInWithGithub}
                            >
                                GitHub
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                class="rounded-md bg-ctp-blue px-2 py-1 text-ctp-base"
                                onClick={signInWithLinkedin}
                            >
                                LinkedIn
                            </button>
                        </li>
                    </ul>
                </div>
            )}
            {getComments().length ? (
                <ul class="mt-4 border-t border-t-ctp-overlay0 pt-2">
                    {getComments().map((comment) => {
                        return (
                            <li class="my-1">
                                <div class="flex flex-row">
                                    <ProfileImage src={comment.userAvatar ?? ""} />
                                    <span>{comment.userName}</span>
                                </div>
                                <p class="block">{comment.content}</p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p class="mt-4">Noch keine Kommentare vorhanden. Sei der Erste!</p>
            )}
        </div>
    );
};

function ProfileImage(props: { src: string | null | undefined }) {
    const [getShowImg, setShowImg] = createSignal<boolean>(!!props.src);

    return (
        <>
            {getShowImg() ? (
                <img
                    src={props.src!}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    class="pointer-events-none block aspect-square h-6 w-6 rounded-md"
                    onError={() => {
                        setShowImg(false);
                    }}
                />
            ) : (
                <svg
                    class="block aspect-square h-6 w-6"
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 63.9998C0 21.3334 64 21.3334 64 64L0 63.9998Z" class="fill-ctp-subtext0" />
                    <circle cx="32" cy="16" r="16" class="fill-ctp-subtext0" />
                </svg>
            )}
        </>
    );
}
