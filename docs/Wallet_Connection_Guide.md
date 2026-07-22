# Wallet Connection Guide (Injective EVM Testnet)

If your wallet is not connecting, transactions are failing, or you see RPC errors, follow this guide.

---

# Required Network Configuration

## Injective EVM Testnet

| Setting | Value |
|----------|----------|
| Network Name | Injective Testnet |
| Chain ID | 1439 |
| Chain ID (Hex) | 0x59f |
| Currency Symbol | INJ |
| RPC URL | https://k8s.testnet.json-rpc.injective.network |
| Block Explorer | https://testnet.blockscout.injective.network |

---

# Add Network Manually

Open browser console while MetaMask is unlocked and run:

```javascript
await ethereum.request({
  method: "wallet_addEthereumChain",
  params: [{
    chainId: "0x59f",
    chainName: "Injective Testnet",
    nativeCurrency: {
      name: "Injective",
      symbol: "INJ",
      decimals: 18
    },
    rpcUrls: [
      "https://k8s.testnet.json-rpc.injective.network"
    ],
    blockExplorerUrls: [
      "https://testnet.blockscout.injective.network"
    ]
  }]
});
```

Expected result:

```javascript
null
```

A `null` response means success.

---

# Switch to Injective Testnet

Run:

```javascript
await ethereum.request({
  method: "wallet_switchEthereumChain",
  params: [{ chainId: "0x59f" }]
});
```

Expected result:

```javascript
null
```

---

# Verify Network

Check current chain:

```javascript
await ethereum.request({
  method: "eth_chainId"
});
```

Expected result:

```javascript
'0x59f'
```

If you see:

```javascript
'0x1'
```

You are still on Ethereum Mainnet.

If you see:

```javascript
'0x7ce'
```

You are on Injective Mainnet.

---

# Verify Wallet Address

```javascript
await ethereum.request({
  method: "eth_accounts"
});
```

Example:

```javascript
[
  "0x9cbe261601b890cf4687a62d5b85ed2fe3de919f"
]
```

---

# Verify Network is Responding

```javascript
await ethereum.request({
  method: "eth_blockNumber"
});
```

Expected:

```javascript
'0x8027244'
```

(any valid hexadecimal block number)

If you receive:

```javascript
RPC endpoint returned too many errors
```

the RPC endpoint is temporarily overloaded.

---

# Check Wallet Balance

```javascript
await ethereum.request({
  method: "eth_getBalance",
  params: [
    "YOUR_WALLET_ADDRESS",
    "latest"
  ]
});
```

Example:

```javascript
await ethereum.request({
  method: "eth_getBalance",
  params: [
    "0x9cbe261601b890cf4687a62d5b85ed2fe3de919f",
    "latest"
  ]
});
```

---

# Send Test Transaction

Example:

```javascript
await ethereum.request({
  method: "eth_sendTransaction",
  params: [{
    from: "YOUR_WALLET_ADDRESS",
    to: "RECIPIENT_ADDRESS",
    value: "0x5af3107a4000"
  }]
});
```

---

# Check Transaction Receipt

```javascript
await ethereum.request({
  method: "eth_getTransactionReceipt",
  params: [
    "YOUR_TRANSACTION_HASH"
  ]
});
```

Successful transaction:

```json
{
  "status": "0x1"
}
```

Failed transaction:

```json
{
  "status": "0x0"
}
```

---

# Common Problems

## Problem: Wallet Connected But Payment Fails

Check:

```javascript
await ethereum.request({
  method: "eth_chainId"
});
```

Must return:

```javascript
'0x59f'
```

---

## Problem: RPC Endpoint Returned Too Many Errors

Example:

```text
RPC endpoint returned too many errors
```

Solution:

1. Open MetaMask.
2. Switch to another network.
3. Switch back to Injective Testnet.
4. Refresh the page.
5. Retry after a few minutes.

---

## Problem: Transaction Never Confirms

Check explorer:

```text
https://testnet.blockscout.injective.network
```

Search your transaction hash.

If explorer shows:

```text
Status: Success
```

then payment succeeded.

---

## Problem: Wallet Connected But App Says Premium Access Not Found

Ensure:

- Transaction completed successfully.
- Transaction hash exists.
- Wallet address matches the wallet used for payment.
- You are connected to Injective Testnet.

---

# Quick Diagnostic Commands

Run these one by one:

```javascript
await ethereum.request({ method: "eth_chainId" })
```

Expected:

```javascript
'0x59f'
```

---

```javascript
await ethereum.request({ method: "eth_accounts" })
```

Expected:

```javascript
['YOUR_WALLET']
```

---

```javascript
await ethereum.request({ method: "eth_blockNumber" })
```

Expected:

```javascript
'0x...'
```

(any block number)

---

```javascript
await ethereum.request({
  method: "eth_getBalance",
  params: [
    "YOUR_WALLET",
    "latest"
  ]
})
```

Expected:

```javascript
'0x...'
```

(balance in wei)

---

# Support Checklist

Before reporting an issue, provide:

- Wallet Address
- Transaction Hash
- Result of `eth_chainId`
- Result of `eth_accounts`
- Screenshot of MetaMask Network
- Screenshot of Browser Console Errors

This information is usually enough to diagnose 95% of wallet connection and payment issues.