import Long from "long";

import { getGrpcClients } from "./utils/grpc";
import { addInvoice, getInfo } from "./utils/lnd-api";
import preimage from "./preimage";

const { lightning: lightningService } = getGrpcClients("service");
const { lightning: lightningWallet } = getGrpcClients("wallet");

async function start() {
  const info = await getInfo(lightningService);
  const addInvoiceResult = await addInvoice(lightningWallet, preimage, Long.fromValue(1000), info.identityPubkey);
  console.log("Invoice: ", addInvoiceResult.paymentRequest);
}

start();
