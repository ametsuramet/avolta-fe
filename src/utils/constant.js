export let PERMISSIONS = "permissions"
export let TOKEN = "token"
export let PROFILE = "profile"

export let NON_TAXABLE_CODES = [
    { value: "-", label: "Non Pajak" },
    { value: "TK/0", label: "Tidak Kawin Tanpa Tanggungan" },
    { value: "TK/1", label: "Tidak Kawin 1 Orang Tanggungan" },
    { value: "TK/2", label: "Tidak Kawin 2 Orang Tanggungan" },
    { value: "TK/3", label: "Tidak Kawin 3 Orang Tanggungan" },
    { value: "K/0", label: "Kawin Tanpa Tanggungan" },
    { value: "K/1", label: "Kawin 1 Orang Tanggungan" },
    { value: "K/2", label: "Kawin 2 Orang Tanggungan" },
    { value: "K/3", label: "Kawin 3 Orang Tanggungan" },
    { value: "K/1/0", label: "Kawin Penghasilan Istri Digabung Dengan Suami Tanpa Tanggungan" },
    { value: "K/1/1", label: "Kawin Penghasilan Istri Digabung Dengan Suami 1 Orang Tanggungan" },
    { value: "K/1/2", label: "Kawin Penghasilan Istri Digabung Dengan Suami 2 Orang Tanggungan" },
    { value: "K/1/3", label: "Kawin Penghasilan Istri Digabung Dengan Suami 3 Orang Tanggungan" }
]