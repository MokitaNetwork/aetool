#!/bin/bash

#peers=()

mkdir -p keys

for i in {1..10}
do
  home=aeth-$i

  if [ ! -d $home ]
  then
    aeth init val$i --home $home --chain-id aethmirror_2221-1 > /dev/null 2>&1

    rm -rf $home/data
    rm $home/config/genesis.json
    cp aeth-1/config/init-data-directory.sh $home/config/init-data-directory.sh
    cp aeth-1/config/priv_validator_state.json.example $home/config/priv_validator_state.json.example
  fi

  cp $home/config/priv_validator_key.json keys/priv_validator_key_$(($i-1)).json

  #peers+=($(aeth tendermint show-node-id --home $home)@$home:26656)
done



