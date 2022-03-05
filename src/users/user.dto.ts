
export class UserDto {
    constructor(email: string, password: string, name: string) {
        this.email = email
        this.password = password
        this.name = name
    }

    id?:number
    email: string
    password: string
    name: string
}