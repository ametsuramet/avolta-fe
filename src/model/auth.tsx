export interface LoginReq {
    email: string
    password: string
    fcmToken: string
    device: string
}
export interface RegisterReq {
    full_name: string
    email: string
    password: string
    fcmToken: string
    device: string
}


export interface Profile {
    full_name: string
    picture: string
    email: string
    role_name: string
}