import { Client, Metadata } from "@grpc/grpc-js";
import Long from "long";

import { lnrpc, routerrpc } from "../proto";
import { grpcMakeUnaryRequest } from "./grpc";

export async function getInfo(lightning: Client) {
  const getInfoRequest = lnrpc.GetInfoRequest.encode({}).finish();
  const response = await grpcMakeUnaryRequest<lnrpc.GetInfoResponse>(
    lightning,
    "/lnrpc.Lightning/GetInfo",
    getInfoRequest,
    lnrpc.GetInfoResponse.decode,
  );
  return response;
}

export async function addInvoice(lightning: Client, rPreimage: Uint8Array, value: Long, pubkey: string) {
  const invoiceRequest = lnrpc.Invoice.encode({
    rPreimage,
    value,
    routeHints: [{hopHints: [{
      nodeId: pubkey,
      chanId: Long.fromString("1234567890"),
      cltvExpiryDelta: 40,
      feeBaseMsat: 1,
      feeProportionalMillionths: 1,
    }]}],
  }).finish();

  const response = await grpcMakeUnaryRequest<lnrpc.AddInvoiceResponse>(
    lightning,
    "/lnrpc.Lightning/AddInvoice",
    invoiceRequest,
    lnrpc.AddInvoiceResponse.decode,
  );
  return response;
}

export function htlcInterceptor(router: Client) {
  return router.makeBidiStreamRequest(
    "/routerrpc.Router/HtlcInterceptor",
    (arg: any) => arg,
    (arg) => arg,
    new Metadata(),
    undefined,
  );
}

export function subscribeHtlcEvents(router: Client) {
  const request = routerrpc.SubscribeHtlcEventsRequest.encode({}).finish();
  return router.makeServerStreamRequest(
    "/routerrpc.Router/SubscribeHtlcEvents",
    (arg: any) => arg,
    (arg) => arg,
    request,
    new Metadata(),
    undefined,
  );
}
