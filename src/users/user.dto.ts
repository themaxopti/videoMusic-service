
export class UserDto {
    constructor(email: string, password: string, name: string) {
        this.email = email
        this.password = password
        this.name = name
    }

    id?:number
    email: string
    password?: string
    name: string
}


export class NewUserDto {
    public name:string
    public email:string
    public id:number
    constructor(model){
        this.name = model.name
        this.email = model.email
        this.id = model.id
    }
}