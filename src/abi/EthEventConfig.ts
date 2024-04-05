export const EthEventConfigAbi = {
    'ABI version': 2,
    version: '2.2',
    header: ['time', 'expire'],
    functions: [
        {
            name: 'constructor',
            inputs: [
                { name: '_owner', type: 'address' },
                { name: '_meta', type: 'cell' },
            ],
            outputs: [],
        },
        {
            name: 'setMeta',
            inputs: [{ name: '_meta', type: 'cell' }],
            outputs: [],
        },
        {
            name: 'setEndBlockNumber',
            inputs: [{ name: 'endBlockNumber', type: 'uint32' }],
            outputs: [],
        },
        {
            name: 'deployEvent',
            inputs: [
                {
                    components: [
                        { name: 'eventTransaction', type: 'uint256' },
                        { name: 'eventIndex', type: 'uint32' },
                        { name: 'eventData', type: 'cell' },
                        { name: 'eventBlockNumber', type: 'uint32' },
                        { name: 'eventBlock', type: 'uint256' },
                    ],
                    name: 'eventVoteData',
                    type: 'tuple',
                },
            ],
            outputs: [],
        },
        {
            name: 'deriveEventAddress',
            inputs: [
                { name: 'answerId', type: 'uint32' },
                {
                    components: [
                        { name: 'eventTransaction', type: 'uint256' },
                        { name: 'eventIndex', type: 'uint32' },
                        { name: 'eventData', type: 'cell' },
                        { name: 'eventBlockNumber', type: 'uint32' },
                        { name: 'eventBlock', type: 'uint256' },
                    ],
                    name: 'eventVoteData',
                    type: 'tuple',
                },
            ],
            outputs: [{ name: 'eventContract', type: 'address' }],
        },
        {
            name: 'getDetails',
            inputs: [{ name: 'answerId', type: 'uint32' }],
            outputs: [
                {
                    components: [
                        { name: 'eventABI', type: 'bytes' },
                        { name: 'staking', type: 'address' },
                        { name: 'eventInitialBalance', type: 'uint64' },
                        { name: 'eventCode', type: 'cell' },
                    ],
                    name: '_basicConfiguration',
                    type: 'tuple',
                },
                {
                    components: [
                        { name: 'chainId', type: 'uint32' },
                        { name: 'eventEmitter', type: 'uint160' },
                        { name: 'eventBlocksToConfirm', type: 'uint16' },
                        { name: 'proxy', type: 'address' },
                        { name: 'startBlockNumber', type: 'uint32' },
                        { name: 'endBlockNumber', type: 'uint32' },
                    ],
                    name: '_networkConfiguration',
                    type: 'tuple',
                },
                { name: '_meta', type: 'cell' },
            ],
        },
        {
            name: 'getFlags',
            inputs: [{ name: 'answerId', type: 'uint32' }],
            outputs: [{ name: '_flags', type: 'uint64' }],
        },
        {
            name: 'getType',
            inputs: [{ name: 'answerId', type: 'uint32' }],
            outputs: [{ name: '_type', type: 'uint8' }],
        },
        {
            name: 'onEventConfirmed',
            inputs: [
                {
                    components: [
                        {
                            components: [
                                { name: 'eventTransaction', type: 'uint256' },
                                { name: 'eventIndex', type: 'uint32' },
                                { name: 'eventData', type: 'cell' },
                                { name: 'eventBlockNumber', type: 'uint32' },
                                { name: 'eventBlock', type: 'uint256' },
                            ],
                            name: 'voteData',
                            type: 'tuple',
                        },
                        { name: 'configuration', type: 'address' },
                        { name: 'staking', type: 'address' },
                        { name: 'chainId', type: 'uint32' },
                    ],
                    name: 'eventInitData',
                    type: 'tuple',
                },
                { name: 'gasBackAddress', type: 'address' },
            ],
            outputs: [],
        },
        {
            name: 'transferOwnership',
            inputs: [{ name: 'newOwner', type: 'address' }],
            outputs: [],
        },
        {
            name: 'renounceOwnership',
            inputs: [],
            outputs: [],
        },
        {
            name: 'owner',
            inputs: [],
            outputs: [{ name: 'owner', type: 'address' }],
        },
        {
            name: 'basicConfiguration',
            inputs: [],
            outputs: [
                {
                    components: [
                        { name: 'eventABI', type: 'bytes' },
                        { name: 'staking', type: 'address' },
                        { name: 'eventInitialBalance', type: 'uint64' },
                        { name: 'eventCode', type: 'cell' },
                    ],
                    name: 'basicConfiguration',
                    type: 'tuple',
                },
            ],
        },
        {
            name: 'networkConfiguration',
            inputs: [],
            outputs: [
                {
                    components: [
                        { name: 'chainId', type: 'uint32' },
                        { name: 'eventEmitter', type: 'uint160' },
                        { name: 'eventBlocksToConfirm', type: 'uint16' },
                        { name: 'proxy', type: 'address' },
                        { name: 'startBlockNumber', type: 'uint32' },
                        { name: 'endBlockNumber', type: 'uint32' },
                    ],
                    name: 'networkConfiguration',
                    type: 'tuple',
                },
            ],
        },
        {
            name: 'meta',
            inputs: [],
            outputs: [{ name: 'meta', type: 'cell' }],
        },
    ],
    data: [
        {
            components: [
                { name: 'eventABI', type: 'bytes' },
                { name: 'staking', type: 'address' },
                { name: 'eventInitialBalance', type: 'uint64' },
                { name: 'eventCode', type: 'cell' },
            ],
            key: 1,
            name: 'basicConfiguration',
            type: 'tuple',
        },
        {
            components: [
                { name: 'chainId', type: 'uint32' },
                { name: 'eventEmitter', type: 'uint160' },
                { name: 'eventBlocksToConfirm', type: 'uint16' },
                { name: 'proxy', type: 'address' },
                { name: 'startBlockNumber', type: 'uint32' },
                { name: 'endBlockNumber', type: 'uint32' },
            ],
            key: 2,
            name: 'networkConfiguration',
            type: 'tuple',
        },
    ],
    events: [
        {
            name: 'OwnershipTransferred',
            inputs: [
                { name: 'previousOwner', type: 'address' },
                { name: 'newOwner', type: 'address' },
            ],
            outputs: [],
        },
        {
            name: 'NewEventContract',
            inputs: [{ name: 'eventContract', type: 'address' }],
            outputs: [],
        },
    ],
    fields: [
        { name: '_pubkey', type: 'uint256' },
        { name: '_timestamp', type: 'uint64' },
        { name: '_constructorFlag', type: 'bool' },
        { name: 'owner', type: 'address' },
        {
            components: [
                { name: 'eventABI', type: 'bytes' },
                { name: 'staking', type: 'address' },
                { name: 'eventInitialBalance', type: 'uint64' },
                { name: 'eventCode', type: 'cell' },
            ],
            name: 'basicConfiguration',
            type: 'tuple',
        },
        {
            components: [
                { name: 'chainId', type: 'uint32' },
                { name: 'eventEmitter', type: 'uint160' },
                { name: 'eventBlocksToConfirm', type: 'uint16' },
                { name: 'proxy', type: 'address' },
                { name: 'startBlockNumber', type: 'uint32' },
                { name: 'endBlockNumber', type: 'uint32' },
            ],
            name: 'networkConfiguration',
            type: 'tuple',
        },
        { name: 'meta', type: 'cell' },
    ],
} as const
