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