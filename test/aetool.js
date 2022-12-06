const Aeth = require('@kava-labs/javascript-sdk');
const BnbApiClient = require('@binance-chain/javascript-sdk');
const { sleep } = require("./helpers.js");

const setup = async (aethEndpoint, binanceEndpoint, aethMnemonic, binanceMnemonic) => {
    // Start new Aeth client
    aethClient = new Aeth.AethClient(aethEndpoint);
    aethClient.setWallet(aethMnemonic);
    aethClient.setBroadcastMode("async");
    await aethClient.initChain();

    // Start Binance Chain client
    const bnbClient = await new BnbApiClient.BncClient(binanceEndpoint);
    bnbClient.chooseNetwork('mainnet');
    const privateKey = BnbApiClient.crypto.getPrivateKeyFromMnemonic(binanceMnemonic);
    bnbClient.setPrivateKey(privateKey);
    bnbClient.chainId = "Binance-Chain-Tigris"
    await bnbClient.initChain()

    // Override the default transaction broadcast endpoint with the tendermint RPC endpoint on the binance-chain node (port 26658 in aetool)
    bnbClient.setBroadcastDelegate(async(signedTx) => {
      const signedBz = signedTx.serialize()
      console.log(signedBz)
      const opts = {
        params: {tx: "0x" + signedBz},
        headers: {
          "content-type": "application/json",
        },
      }
      var result
      try {
         result = await bnbClient._httpClient.request(
          "get",
          `http://localhost:26658/broadcast_tx_commit`,
          null,
          opts
        )
      } catch (error) {
        console.log(error)
      }

      return result
    })

    return { aethClient: aethClient, bnbClient: bnbClient };
}

const loadAethDeputies = async (aethClient, assets, amount) => {
    var counter = 0;
    for (var denom in assets) {
        const assetInfo = assets[denom];
        const coins = Aeth.utils.formatCoins(amount * assetInfo.conversionFactor, assetInfo.aethDenom);
        const txHash = await aethClient.transfer(assetInfo.aethDeputyHotWallet, coins);
        console.log("Load", assetInfo.aethDenom, "deputy:", txHash);

        counter++;
        counter < Object.keys(assets).length ? await sleep(7000) : await sleep(3000);
    }
    console.log("")
}
const loadBinanceChainDeputies = async (bnbClient, assets, amount) => {
 for (var denom in assets) {
    const assetInfo = assets[denom];
    const res = await bnbClient.transfer(bnbClient.getClientKeyAddress(),
      assetInfo.binanceChainDeputyHotWallet, amount, assetInfo.binanceChainDenom);

    if (res && res.status == 200) {
      console.log('\tLoad', assetInfo.binanceChainDenom, 'deputy:', res.result.result.hash, '\n');
    } else {
      console.log('Tx error:', res);
      return;
    }

    await sleep(2000);
  }
}

module.exports = {
    setup,
    loadAethDeputies,
    loadBinanceChainDeputies
}
