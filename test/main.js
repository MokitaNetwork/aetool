const {AETH_ENDPOINT_AETOOL, BINANCE_CHAIN_ENDPOINT_AETOOL, LOADED_AETH_MNEMONIC,
    LOADED_BINANCE_CHAIN_MNEMONIC, BEP3_ASSETS } = require("./config.js");
const { setup, loadAethDeputies } = require("./aetool.js");
const { incomingSwap, outgoingSwap } = require("./swap.js");

var main = async () => {
    // Initialize clients compatible with aetool
    const clients = await setup(AETH_ENDPOINT_AETOOL, BINANCE_CHAIN_ENDPOINT_AETOOL,
        LOADED_AETH_MNEMONIC, LOADED_BINANCE_CHAIN_MNEMONIC);

    // Load each Aeth deputy hot wallet
    await loadAethDeputies(clients.aethClient, BEP3_ASSETS, 100000);

    await incomingSwap(clients.aethClient, clients.bnbClient, BEP3_ASSETS, "busd", 10200005);
    // await outgoingSwap(clients.aethClient, clients.bnbClient, BEP3_ASSETS, "busd", 500005);
};

main();
