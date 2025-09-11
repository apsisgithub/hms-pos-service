import { BadRequestException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";

export class OrderValidator {
  static validateOrderTotals(dto: CreateOrderDto) {
    const {
      items,
      subtotal,
      tax = 0,
      service_charge = 0,
      discount = 0,
      grand_total,
    } = dto;

    let calculatedSubtotal = 0;

    if (!Array.isArray(items)) {
      throw new BadRequestException("Order items are missing or invalid.");
    }

    for (const item of items) {
      const addonsTotal =
        item.addons?.reduce((sum, a) => sum + (a.extra_price || 0), 0) || 0;

      // Validate addon price
      if (item.addon_price !== addonsTotal) {
        throw new BadRequestException(
          `Addon price mismatch for product ${item.product_id}. Expected ${addonsTotal}, got ${item.addon_price}`
        );
      }

      // Validate item subtotal
      const expectedSubtotal = (item.unit_price + addonsTotal) * item.quantity;
      if (item.subtotal !== expectedSubtotal) {
        throw new BadRequestException(
          `Subtotal mismatch for product ${item.product_id}. Expected ${expectedSubtotal}, got ${item.subtotal}`
        );
      }

      calculatedSubtotal += expectedSubtotal;
    }

    // Validate order subtotal
    if (subtotal !== calculatedSubtotal) {
      throw new BadRequestException(
        `Order subtotal mismatch. Expected ${calculatedSubtotal}, got ${subtotal}`
      );
    }

    // Validate grand total
    const expectedGrandTotal = subtotal + tax + service_charge - discount;
    if (grand_total !== expectedGrandTotal) {
      throw new BadRequestException(
        `Grand total mismatch. Expected ${expectedGrandTotal}, got ${grand_total}`
      );
    }
  }
}
