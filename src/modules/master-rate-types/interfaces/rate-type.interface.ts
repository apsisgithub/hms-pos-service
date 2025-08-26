import { RoomTypeRate } from "./room-type-rates.interface";

export interface RateTypeResponse {
    id: number;
    sbu_id: number;
    name: string;
    short_code: string;
    is_tax_included: boolean;
    room_type_rates: RoomTypeRate[];
}
