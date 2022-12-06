const {AETH_ENDPOINT_AETOOL, BINANCE_CHAIN_ENDPOINT_AETOOL, LOADED_AETH_MNEMONIC,
    LOADED_BINANCE_CHAIN_MNEMONIC, BEP3_ASSETS } = require("./config.js");
const { setup, loadKavaDeputies } = require("./aetool.js");
const { incomingSwap, outgoingSwap } = require("./swap.js");

var main = async () => {
    // Initialize clients compatible with aetool
    const clients = await setup(AETH_ENDPOINT_AETOOL, BINANCE_CHAIN_ENDPOINT_AETOOL,
        LOADED_AETH_MNEMONIC, LOADED_BINANCE_CHAIN_MNEMONIC);

    // Load each Kava deputy hot wallet
    await loadKavaDeputies(clients.kavaClient, BEP3_ASSETS, 100000);

    await incomingSwap(clients.kavaClient, clients.bnbClient, BEP3_ASSETS, "busd", 10200005);
    // await outgoingSwap(clients.kavaClient, clients.bnbClient, BEP3_ASSETS, "busd", 500005);
};

main();
