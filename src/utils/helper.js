import { TOKEN, PERMISSIONS, PROFILE } from "./constant";
import * as CryptoJS from 'crypto-js';
import Swal from "sweetalert2";

export async function customFetch(...args) {
    let [resource, config, multipart, fullUrl] = args;
    const token = await asyncLocalStorage.getItem(TOKEN)
    // const companyID = localStorage.getItem(SELECTED_COMPANY_ID)
    // const merchantID = localStorage.getItem(SELECTED_MERCHANT_ID)

    if (!config) {
        config = {
            headers: {
                authorization: `Bearer ${token ?? null}`
            }
        }
    } else {
        config["headers"] = {
            authorization: `Bearer ${token ?? null}`
        }
    }


    if (!multipart) {
        config["headers"]["Content-Type"] = "application/json"
    }
    // if (companyID) {
    //     config["headers"]["ID-Company"] = companyID
    // }
    // if (merchantID) {
    //     config["headers"]["ID-Merchant"] = merchantID
    // }

    try {
        // request interceptor here
        const response = await fetch(fullUrl ? resource : `${import.meta.env.VITE_API_URL}/${resource}`, config);

        if (response.status !== 200) {
            var respJson = await response.json()
            throw (respJson.message)
        }

        // response interceptor here
        return response;
    } catch (error) {

        if (error == "Token is expired") {
            await clearStorage()
            location.href = "/login"
        }
        return Promise.reject(error)
    }


}



export async function asyncSetStorage({ token, permissions, profile }) {
    await asyncLocalStorage.setItem(TOKEN, token);
    await asyncLocalStorage.setItem(PERMISSIONS, JSON.stringify(permissions));
    await asyncLocalStorage.setItem(PROFILE, JSON.stringify(profile));
}


export async function getStoragePermissions() {
    let permissions = await asyncLocalStorage.getItem(PERMISSIONS)
    if (permissions) return JSON.parse(permissions)
    return []
}
export async function getStorageProfile() {
    let profile = await asyncLocalStorage.getItem(PROFILE)
    if (profile) return JSON.parse(profile)
    return null
}


export async function clearStorage() {
    await asyncLocalStorage.removeItem(TOKEN);
    await asyncLocalStorage.removeItem(PERMISSIONS);
}

export const asyncLocalStorage = {
    async setItem(key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, encrypt(value));
        });
    },
    async getItem(key) {
        return Promise.resolve().then(function () {
            let data = localStorage.getItem(key) || "";
            return decrypt(data) || null;
        });
    },
    async removeItem(key) {
        return Promise.resolve().then(function () {
            return localStorage.removeItem(key);
        });
    }
};


function encrypt(txt) {
    return CryptoJS.AES.encrypt(txt, import.meta.env.VITE_SECRET_KEY).toString();
}

function decrypt(txtToDecrypt) {
    return CryptoJS.AES.decrypt(txtToDecrypt, import.meta.env.VITE_SECRET_KEY).toString(CryptoJS.enc.Utf8);
}

export function randomStr(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}



export const money = (val, friction = 2) => {
    if (!val) return 0
    return val.toLocaleString('id-ID', { maximumFractionDigits: friction });
}




export function setNullString(val) {
    return { Valid: val != null && val != "", String: val }
}

export function setNullTime(val) {
    return { Valid: val != null && val != "", Time: val }
}

export function getFullName(f, m, l) {
    let fullName = []
    if (f) fullName.push(f)
    if (m) fullName.push(m)
    if (l) fullName.push(l)

    return fullName.join(" ")
}


export function confirmDelete(confirmed, title, desc, confirmText) {
    Swal.fire({
        title: title ?? "Anda Yakin",
        text: desc ?? "Anda tidak akan dapat mengembalikan proses ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: confirmText ?? "Ya, Hapus!",
        cancelButtonText: "Batal"
    }).then((result) => {
        if (result.isConfirmed) {
            confirmed()
        }
    });
}

export function pad(num, size) {
    return num.toString().padStart(size, "0");
}