export interface ICaculateShippingCostInput {
    service_type_id: number,
    insurance_value: number,
    coupon: string,
    from_district_id: number,
    to_district_id: number,
    to_ward_code: string,
    items: string[]
}

export interface IShippedFood {
    name: string,
    quantity: number,
    height: number,
    weight: number,
    length: number,
    width: number
}

export interface ICreateShippingOrder {
    fromWardCode: string,
    toWardCode: string,
    toDistrictId: number,
    items?: string[]
}