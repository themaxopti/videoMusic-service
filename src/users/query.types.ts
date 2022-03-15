export interface LoginBody {
    name:string
    email:string
    password:string
}
 
export interface LoginResponse {
    id:number
    accessToken:string
    name:string
    subscribers_count:number
    email:string
    isActive:boolean
}


export interface ActiveParams {
    link:string
}

export interface AuthParams {
    userId:number
}

export interface AuthResponse {
    id:number
    email:string
    is_active:boolean
    subscribers_count:number
    activate_link:string
    name:string
}

export interface RefreshParams {
    refreshToken:string
}

export interface RefreshResponse {
    accessToken:string
}

