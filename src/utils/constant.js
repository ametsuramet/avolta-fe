export let PERMISSIONS = "permissions"
export let TOKEN = "token"
export let PROFILE = "profile"
export let COMPANY_ID = "company-id"

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
export let EMPLOYEE_STATUS = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Paruh Waktu" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "FLEXIBLE", label: "Flexible" },
    { value: "SHIFT", label: "Shift" },
    { value: "SEASONAL", label: "Pekerja Musiman" },
]
export let AUTO_NUMERIC_FORMAL = [
    "{month-roman}",
    "{month-mm}",
    "{month-mmm}",
    "{month-mmmm}",
    "{year-yyyy}",
    "{year-yy}",
    "{auto-numeric}",
    "{random-numeric}",
    "{random-character}",
    "{static-character}",
]