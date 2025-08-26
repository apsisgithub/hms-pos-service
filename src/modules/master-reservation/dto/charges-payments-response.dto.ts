import { ApiProperty } from "@nestjs/swagger";

export class ChargesPaymentsItemDto {
    @ApiProperty({
        description: "Creation date and time",
        example: "2025-01-08T10:30:00.000Z",
    })
    created_at: Date;

    @ApiProperty({
        description: "Reference number",
        example: 1,
    })
    ref_no: number;

    @ApiProperty({
        description: "Type - payment mode for payments, charge type for charges",
        example: "Online" // or "RoomCharges"
    })
    type: string;

    @ApiProperty({
        description: "Description of the transaction",
        example: "Payment for reservation 123",
    })
    description: string;

    @ApiProperty({
        description: "User who created the record",
        example: {
            id: 1,
            name: "John Doe",
            email: "john@example.com"
        }
    })
    user: {
        id: number;
        name: string;
        email: string;
    };

    @ApiProperty({
        description: "Amount",
        example: 150.75,
    })
    amount: number;

    @ApiProperty({
        description: "Record type - 'payment' or 'charge'",
        example: "payment",
    })
    record_type: string;
}

export class ChargesPaymentsResponseDto {
    @ApiProperty({
        description: "List of charges and payments",
        type: [ChargesPaymentsItemDto],
    })
    data: ChargesPaymentsItemDto[];

    @ApiProperty({
        description: "Total number of records",
        example: 25,
    })
    total: number;

    @ApiProperty({
        description: "Current page number",
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: "Number of items per page",
        example: 10,
    })
    limit: number;
}