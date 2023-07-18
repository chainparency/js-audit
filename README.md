# JS-AUDIT

A CLI tool for a verifying Public Traces from Gotrace.

## Installation

Clone the repository:

```
git clone git@github.com:chainparency/js-audit.git
```

Install the dependencies:

```
npm i
```


## Usage

1. To download a public trace:

```
node index.js download PUBLIC_TRACE_ID
```

2. To verify a downloaded trace:

```
node index.js verify PUBLIC_TRACE_ID
```

## Manual public trace verification

1. Download and verify a public trace using the download/verify commands using this cli
2. Install multihash library https://github.com/multiformats/go-multihash/tree/master/multihash
3. Calculate hash of every checkpoint using the following command:

```
multihash -algorithm="sha2-256" -encoding="base58" checkpoint_{CHECKPOINT_ID}
```
4. Confirm that calculated hash and the hash on the blockchain are the same (https://explorer.gochain.io/tx/TX_ID).
