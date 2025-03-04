# aetool

Assorted dev tools for working with the aeth blockchain.

## Installation

```bash
make install
```

## Initialization: aetool testnet

Note: The current mainnet version of aeth is `v0.16.0`. To start a local testnet
with the current mainnet version use `--aeth.configTemplate v0.16`. To start a
local testnet with the latest unreleased version, use
`--aeth configTemplate master`

Option 1:

The `aetool testnet bootstrap` command starts a local Aeth blockchain as a
background docker container called `generated_aethnode_1`. The bootstrap command
only starts the Aeth blockchain and Aeth REST server services.

```bash
# Start new testnet
aetool testnet bootstrap --aeth.configTemplate master
```

Option 2:

To generate a testnet for aeth, binance chain, and a deputy that relays swaps between them:

```bash
# Generate a new aetool configuration based off template files
aetool testnet gen-config aeth binance deputy --aeth.configTemplate master

# Pull latest docker images. Docker must be running.
cd ./full_configs/generated && docker-compose pull

# start the testnet
aetool testnet up

# When finished with usage, shut down the processes
aetool testnet down
```

### Flags

Additional flags can be added when initializing a testnet to add additional
services:

`--ibc`: Run Aeth testnet with an additional IBC chain

Example:

```bash
# Run Aeth testnet with an additional IBC chain
aetool testnet bootstrap --aeth.configTemplate master --ibc
```

`--geth`: Run a go-ethereum node alongside the Aeth testnet. The geth node is
initialized with the Aeth Bridge contract and test ERC20 tokens. The Aeth EVM
also includes Multicall contracts deployed. The contract addresses can be found
on the [kava-labs/aeth-bridge](https://github.com/kava-labs/aeth-bridge#development)
README.

Example:

```bash
# Run the testnet with a geth node in parallel
aetool testnet bootstrap --aeth.configTemplate master --geth
```

Geth node ports are **not** default, as the Aeth EVM will use default JSON-RPC
ports:

Aeth EVM RPC Ports:

* HTTP JSON-RPC: `8545`
* WS-RPC port: `8546`

Geth RPC Ports:

* HTTP JSON-RPC: `8555`
* WS-RPC port: `8556`

To connect to the associated Ethereum wallet with Metamask, setup a new network with the following parameters:
* New RPC URL: `http://localhost:8555`
* Chain ID: `88881` (configured from the [genesis](config/templates/geth/initstate/genesis.json#L3))
* Currency Symbol: `ETH`

Finally, connect the mining account by importing the JSON config in [this directory](config/templates/geth/initstate/.geth/keystore)
with [this password](config/templates/geth/initstate/eth-password).

## Usage: aetool testnet

REST APIs for both blockchains are exposed on localhost:

- Aeth: http://localhost:1317
- Binance Chain: http://localhost:8080

You can also interact with the blockchain using the `aeth` command line. In a
new terminal window, set up an alias to `aeth` on the dockerized aeth node and
use it to send a query.

```bash
# Add an alias to the dockerized aeth cli
alias daeth='docker exec -it generated_aethnode_1 aeth'

# Confirm that the alias has been added
alias aeth

# For versions before v0.16.x
alias dkvcli='docker exec -it generated_aethnode_1 kvcli'
```

You can test the set up and alias by executing a sample query:

```bash
daeth status
daeth q cdp params
```

To send transactions you'll need to recover a user account in the dockerized environment. Valid mnemonics for the blockchains be found in the `config/common/addresses.yaml` file.

```bash
# Recover user account
daeth keys add user --recover
# Enter mnemonic
arrive guide way exit polar print kitchen hair series custom siege afraid shrug crew fashion mind script divorce pattern trust project regular robust safe
```

Test transaction sending by transferring some coins to yourself.

```bash
# Query the recovered account's address
daeth keys show user -a
# Send yourself some coins by creating a send transaction with your address as both sender and receiver
daeth tx bank send [user-address] [user-address] 1000000uaeth --from user
# Enter 'y' to confirm the transaction
confirm transaction before signing and broadcasting [y/N]:

# Check transaction result by tx hash
daeth q tx [tx-hash]
```

## Shut down: aetool testnet

When you're done make sure to shut down the aetool testnet. Always shut down the aetool testnets before pulling the latest image from docker, otherwise you may experience errors.

```bash
aetool testnet down
```
