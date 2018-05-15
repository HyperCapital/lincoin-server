import { ContractTypes } from "../constants";
import { default as p2pChannelFactory } from "./p2pChannelFactory";

export default {
  [ ContractTypes.P2PChannelFactory ]: p2pChannelFactory,
};
