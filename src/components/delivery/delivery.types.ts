export interface ICaculateShippingCostInput {
    service_id: number,
    insurance_value: number,
    coupon: string,
    from_district_id: number,
    to_district_id: number,
    to_ward_code: string,
    height: number,
    length: number,
    weight: number,
    width: number
}