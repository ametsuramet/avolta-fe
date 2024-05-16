import { LoginReq } from "@/model/auth";
import { customFetch } from "@/utils/helper";


export const login = async (req: LoginReq) => {
    
    return await customFetch("admin/login", {
        method: "POST",
        body: JSON.stringify(req)
    })

} 
export const getProfile = async () => {
    
    return await customFetch("admin/my")

} 