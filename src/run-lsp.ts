import { getGrpcClients } from "./utils/grpc";
import { htlcInterceptor, subscribeHtlcEvents } from "./utils/lnd-api";
import { routerrpc } from "./proto";
import preimage from "./preimage";

const { router } = getGrpcClients("service");

function interceptHtlc() {
  const stream = htlcInterceptor(router);

  stream.on("data", async (data) => {
    console.log("\nINTERCEPTING HTLC\n-----------");
    const request = routerrpc.ForwardHtlcInterceptRequest.decode(data);
    console.log("outgoingAmountMsat", request.outgoingAmountMsat.toString());
    console.log("outgoingRequestedChanId", request.outgoingRequestedChanId.toString());
    console.log("incomingCircuitKey.chanId", request.incomingCircuitKey?.chanId?.toString());
    console.log("incomingCircuitKey.htlcId", request.incomingCircuitKey?.htlcId?.toString());

    const settleResponse = routerrpc.ForwardHtlcInterceptResponse.encode({
      action: routerrpc.ResolveHoldForwardAction.SETTLE,
      incomingCircuitKey: request.incomingCircuitKey,
      preimage,
    }).finish();
    stream.write(settleResponse);
  });

  stream.on("error", (error) => {
    console.log("error");
    console.log(error);
  });
};

function subscribeHtlc() {
  const stream = subscribeHtlcEvents(router);

  stream.on("data", async (data) => {
    console.log("\nINCOMING HTLC EVENT\n-----------");
    const htlcEvent = routerrpc.HtlcEvent.decode(data);
    console.log("event", htlcEvent.event);
    console.log("incomingChannelId", htlcEvent.incomingChannelId.toString());
    console.log("incomingHtlcId", htlcEvent.incomingHtlcId.toString());
    console.log("outgoingChannelId", htlcEvent.outgoingChannelId.toString());
    console.log("outgoingHtlcId", htlcEvent.outgoingChannelId.toString());
  });
};

interceptHtlc();
subscribeHtlc();
console.log("Started");


export const hexToUint8Array = (hexString: string) => {
  return new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
};
