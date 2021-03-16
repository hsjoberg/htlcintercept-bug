# About

This project demonstrates the HtlcIntercept replay bug.
It occurs when using the HtlcIntercept gRPC API to settle an incoming forward HTLC.

To demonstrate the issue, a special invoice will be created with route hints to the intermediary
node which will settle the incoming forward HTLC.

# Prerequisites

You need three nodes for this, the `wallet`, the `service` and the `payer`.  
The `wallet` and the `service` has to be accessible through gRPC.  
The `payer` and the `service` must have a channel between eachother.

# Setup



# Run

To test, do the following:

- Setup the nodes in `config/default.json`
- Run `npm run run-lsp` to start the intermediary node (`service`) which will intercept and settle the HTLC
- Run `npm run create-invoice` to create an invoice for the `wallet`
- Pay the invoice via the `payer`.
- Disconnect `payer` from the network by shutting down HTLC and start it up again, on the `service`
  node application, a _new_  intercept message will appear, but notice that no new payments have been sent:
  ```
  INTERCEPTING HTLC
  -----------
  outgoingAmountMsat 1000000
  outgoingRequestedChanId 1234567890
  incomingCircuitKey.chanId 1000555581341697
  incomingCircuitKey.htlcId 0
  ```

