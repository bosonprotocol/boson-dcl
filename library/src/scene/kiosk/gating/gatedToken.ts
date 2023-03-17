import { eGateTokenType } from "../enums";

export class GatedToken {
  amountNeeded = 0;
  name = "";
  tokenAddress = "";
  meetsRequirement = false;
  tokenType: eGateTokenType = eGateTokenType.token;

  constructor(
    _amountNeeded: number,
    _name: string,
    _tokenAddress: string,
    _tokenType: eGateTokenType
  ) {
    this.amountNeeded = _amountNeeded;
    this.name = _name;
    this.tokenAddress = _tokenAddress;
    this.tokenType = _tokenType;
  }

  setRequirement(_meetsRequirements: boolean) {
    this.meetsRequirement = _meetsRequirements;
  }
}
