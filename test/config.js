// Endpoints
const AETH_ENDPOINT_AETOOL = "http://localhost:1317";
const BINANCE_CHAIN_ENDPOINT_AETOOL = "http://localhost:8080";

// Mnemonics
const LOADED_AETH_MNEMONIC = "arrive guide way exit polar print kitchen hair series custom siege afraid shrug crew fashion mind script divorce pattern trust project regular robust safe";
const LOADED_BINANCE_CHAIN_MNEMONIC = "village fiscal december liquid better drink disorder unusual tent ivory cage diesel bike slab tilt spray wife neck oak science beef upper chapter blade";

// BEP3 assets
const BEP3_ASSETS = {
  "bnb": {
    aethDenom: "bnb",
    binanceChainDenom: "BNB",
    aethDeputyHotWallet: "aeth1agcvt07tcw0tglu0hmwdecsnuxp2yd45f3avgm",
    binanceChainDeputyHotWallet: "bnb1zfa5vmsme2v3ttvqecfleeh2xtz5zghh49hfqe",
    conversionFactor: 10 ** 8
  },
  "btcb": {
    aethDenom: "btcb",
    binanceChainDenom: "BTCB-1DE",
    aethDeputyHotWallet: "aeth1kla4wl0ccv7u85cemvs3y987hqk0afcv7vue84",
    binanceChainDeputyHotWallet: "bnb1z8ryd66lhc4d9c0mmxx9zyyq4t3cqht9mt0qz3",
    conversionFactor: 10 ** 8
  },
  "xrpb": {
    aethDenom: "xrpb",
    binanceChainDenom: "XRP-BF2",
    aethDeputyHotWallet: "aeth14q5sawxdxtpap5x5sgzj7v4sp3ucncjlpuk3hs",
    binanceChainDeputyHotWallet: "bnb1ryrenacljwghhc5zlnxs3pd86amta3jcaagyt0",
    conversionFactor: 10 ** 8
  },
  "busd": {
    aethDenom: "busd",
    binanceChainDenom: "BUSD-BD1",
    aethDeputyHotWallet: "aeth1j9je7f6s0v6k7dmgv6u5k5ru202f5ffsc7af04",
    binanceChainDeputyHotWallet: "bnb1j20j0e62n2l9sefxnu596a6jyn5x29lk2syd5j",
    conversionFactor: 10 ** 8
  },
}

module.exports = {
  AETH_ENDPOINT_AETOOL,
  BINANCE_CHAIN_ENDPOINT_AETOOL,
  LOADED_AETH_MNEMONIC,
  LOADED_BINANCE_CHAIN_MNEMONIC,
  BEP3_ASSETS
}
