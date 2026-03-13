
"use server"
import { httpClient } from "@/lib/axios/httpClient"
import { setTokenInCookies } from "@/lib/tokenUtils";

const BaseApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
if(!BaseApiUrl){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined!");
}

const getDoctors = async()=> {
    const doctors = await httpClient.get('/doctors');
}

export async function refreshToken(refreshToken:string): Promise<boolean>  {
    try{

        const res = await fetch(`${BaseApiUrl}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }
        const {data} = await res.json();
        const {accessToken, refreshToken:newRefreshToken, token} = data;

        if(accessToken){
            await setTokenInCookies('accessToken', accessToken);
        }
        if(newRefreshToken){
            await setTokenInCookies('refreshToken', newRefreshToken);
        }
        if(token){
            await setTokenInCookies('better-auth.session_token', token);

        }

        return true;
    }catch (error: any){
        console.error("Error refreshing token:", error);
        return false;

    }
}