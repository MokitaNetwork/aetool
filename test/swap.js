const Aeth = require('@kava-labs/javascript-sdk');
const { sleep } = require("./helpers.js");

const incomingSwap = async (aethClient, bnbClient, assets, denom, amount) => {
  const assetInfo = assets[denom];
  if(!assetInfo) {
      throw new Error(denom + " is not supported by aetool BEP3");
  }

  // Assets involved in the swap
  const asset = assetInfo.binanceChainDenom;

  // Addresses involved in the swap
  const sender = bnbClient.getClientKeyAddress();
  const recipient = assetInfo.binanceChainDeputyHotWallet; // deputy's address on Binance Chain
  const senderOtherChain = assetInfo.aethDeputyHotWallet; // deputy's address on Aeth
  const recipientOtherChain = aethClient.wallet.address;

  // Format asset/amount parameters as tokens, expectedIncome
  const tokens = [
    {
      denom: asset,
      amount: amount,
    },
  ];
  const expectedIncome = [String(amount), ':', asset].join('');

  // Number of blocks that swap will be active
  const heightSpan = 10001;

  // Generate random number hash from timestamp and hex-encoded random number
  let randomNumber = Aeth.utils.generateRandomNumber();
  const timestamp = Math.floor(Date.now() / 1000);
  const randomNumberHash = Aeth.utils.calculateRandomNumberHash(
    randomNumber,
    timestamp
  );
  console.log('Secret random number:', randomNumber);

  const swapIDs = calcSwapIDs(randomNumberHash, sender, senderOtherChain);
  console.log('Expected Binance Chain swap ID:', swapIDs.origin);

  // Send create swap tx using Binance Chain client
  console.log('\nRaw transaction data:')
  const res = await bnbClient.swap.HTLT(
    sender,
    recipient,
    recipientOtherChain,
    senderOtherChain,
    randomNumberHash,
    timestamp,
    tokens,
    expectedIncome,
    heightSpan,
    true
  );

  if (res && res.status == 200) {
    console.log('\nCreate swap tx hash (Binance Chain): ', res.result.result.hash);
  } else {
    console.log('Tx error:', res);
    return;
  }
  // Wait for deputy to see the new swap on Binance Chain and relay it to Aeth
  console.log('Waiting for deputy to witness and relay the swap...');
  console.log('Expected Aeth swap ID:', swapIDs.dest);

  await sleep(45000); // 45 seconds
  await aethClient.getSwap(swapIDs.dest);

  // Send claim swap tx using Aeth client
  const txHashClaim = await aethClient.claimSwap(
    swapIDs.dest,
    randomNumber
  );
  console.log('Claim swap tx hash (Aeth): '.concat(txHashClaim));

  // Check the claim tx hash
  const txRes = await aethClient.checkTxHash(txHashClaim, 15000);
  console.log('\nTx result:', txRes.raw_log);
};

const outgoingSwap = async(aethClient, bnbClient, assets, denom, amount) => {
  const assetInfo = assets[denom];
  if(!assetInfo) {
    throw new Error(denom + " is not supported by aetool BEP3");
  }

  const sender = aethClient.wallet.address;
  const recipient = assetInfo.aethDeputyHotWallet; // deputy's address on aeth
  const senderOtherChain = assetInfo.binanceChainDeputyHotWallet; // deputy's address on bnbchain
  const recipientOtherChain = bnbClient.getClientKeyAddress();

  // Set up params
  const asset = assetInfo.aethDenom;

  const coins = Aeth.utils.formatCoins(amount, asset);
  const heightSpan = "250";

  // Generate random number hash from timestamp and hex-encoded random number
  const randomNumber = Aeth.utils.generateRandomNumber();
  const timestamp = Math.floor(Date.now() / 1000);
  const randomNumberHash = Aeth.utils.calculateRandomNumberHash(
    randomNumber,
    timestamp
  );
  console.log("\nSecret random number:", randomNumber.toUpperCase());

  const swapIDs = calcSwapIDs(randomNumberHash, sender, senderOtherChain);
  console.log('Expected Aeth swap ID:', swapIDs.origin);

  const txHash = await aethClient.createSwap(
    recipient,
    recipientOtherChain,
    senderOtherChain,
    randomNumberHash,
    timestamp,
    coins,
    heightSpan
  );

  console.log("\nTx hash (Create swap on Aeth):", txHash);

  // Wait for deputy to see the new swap on Aeth and relay it to Binance Chain
  console.log("Waiting for deputy to witness and relay the swap...")
  console.log('Expected Binance Chain swap ID:', swapIDs.dest);
  await sleep(45000); // 45 seconds


  console.log('\nRaw transaction data:')
  const res = await bnbClient.swap.claimHTLT(bnbClient.getClientKeyAddress(), swapIDs.dest, randomNumber);
  if (res && res.status == 200) {
    console.log(
      "\nClaim swap tx hash (Binance Chain): ",
      res.result.result.hash
    );
  } else {
    console.log("Tx error:", res);
    return;
  }
};

// Print swap IDs
var calcSwapIDs = (randomNumberHash, sender, senderOtherChain) => {
  // Calculate the expected swap ID on origin chain
  const originChainSwapID = Aeth.utils.calculateSwapID(
    randomNumberHash,
    sender,
    senderOtherChain
  );

  // Calculate the expected swap ID on destination chain
  const destChainSwapID = Aeth.utils.calculateSwapID(
    randomNumberHash,
    senderOtherChain,
    sender
  );

  return { origin: originChainSwapID, dest: destChainSwapID }
};

module.exports = {
    incomingSwap,
    outgoingSwap
}
