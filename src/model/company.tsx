export interface Company {
    id: string
    name: string
    logo: string
    cover: string
    legal_entity: string
    email: string
    phone: string
    fax: string
    address: string
    contact_person: string
    contact_person_position: string
    tax_payer_number: string
    logo_url?: string
    cover_url?: string
}


export interface CompanyReq {
    name: string
    logo: string
    cover: string
    legal_entity: string
    email: string
    phone: string
    fax: string
    address: string
    contact_person: string
    contact_person_position: string
    tax_payer_number: string
}
