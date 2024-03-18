import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PaymentCommand {
    invoiceReference: string;
    amount: number;
    currency: string;
    applicationKey: string;//Vendor
    callbackUrl: string
}
export class PaymentReceiptCommand {
    @ApiProperty()
    @IsNotEmpty()
    referenceNo: string;
    @ApiProperty()
    @IsNotEmpty()
    status: string;
    transactionNumber: string;

}

