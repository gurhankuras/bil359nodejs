import { omit } from "lodash"

export function processHospital(hospital: any) {
    
    let h = {id: hospital.id, hospital_name: hospital.hospital_name}
    // @ts-ignore
    h.address = omit(hospital, ['id', 'hospital_name'])
    return h
}
