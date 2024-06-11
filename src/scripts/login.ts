import { supabase } from "./supabase";

const requestUrl = new URL(location.href);
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
    const urlParams = new URLSearchParams(requestUrl.hash.replace(/^#/, ""));
    tryLogin(urlParams);
}
tryLogin(requestUrl.searchParams);
