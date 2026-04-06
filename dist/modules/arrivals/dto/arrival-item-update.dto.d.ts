declare const CONDITIONS: readonly ["OK", "DAMAGED", "LOST"];
export declare class ArrivalItemUpdateDto {
    arrivedQuantity?: number;
    condition?: (typeof CONDITIONS)[number] | null;
    notes?: string | null;
}
export {};
