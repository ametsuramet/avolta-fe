import { LoginReq, RegisterReq } from "@/model/auth";
import { CompanyReq } from "@/model/company";
import { customFetch } from "@/utils/helper";


export const login = async (req: LoginReq) => {
    
    return await customFetch("admin/login", {
        method: "POST",
        body: JSON.stringify(req)
    })

} 

export const register = async (req: RegisterReq) => {
    
    return await customFetch("admin/register", {
        method: "POST",
        body: JSON.stringify(req)
    })

} 
export const createCompany = async (req: CompanyReq, token: string) => {
    console.log("token", token)
    return await customFetch("admin/create/company", {
        method: "POST",
        body: JSON.stringify(req),
       
    }, null, null, token)

} 
export const verification = async (token: string) => {
    
    return await customFetch("admin/verification/"+token, {
        method: "POST",
    })

} 
export const getProfile = async () => {
    
    return await customFetch("admin/my")

} 