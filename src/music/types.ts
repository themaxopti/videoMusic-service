export interface AddTrackBody {
    title:string
    description:string
    picture:string
    track:any
}

export interface AddTrackResponse {

}


export interface AddCommentBody {
    title:string
    trackId:number
    description:string
}

export interface TrackComment { 
    id:number
    title:string 
    description:string
    track_id:string
    author_id:string
}