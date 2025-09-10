import { OrderToken, TokenType } from "src/entities/pos/order_token.entity";
import { DataSource } from "typeorm";

export class TokenService {
  /**
   * Generate a new token number for the given outlet
   */
  static async generateTokenNumber(
    dataSource: DataSource,
    outletId: number,
    type: TokenType = TokenType.KOT
  ): Promise<string> {
    const repo = dataSource.getRepository(OrderToken);

    // Find latest token for outlet and type
    const lastToken = await repo.findOne({
      where: { type },
      order: { id: "DESC" },
    });

    let serial = 1;
    if (lastToken) {
      const lastNum = parseInt(lastToken.token_number.replace(/\D/g, ""), 10);
      if (!isNaN(lastNum)) {
        serial = lastNum + 1;
      }
    }

    // Format K1001, K1002, etc.
    return `${type[0]}${outletId}${serial.toString().padStart(3, "0")}`;
  }
}
