/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export declare namespace Escrow {
  export type LoanReviewStruct = {
    nft: AddressLike;
    tokenId: BigNumberish;
    spender: AddressLike;
    token: AddressLike;
    value: BigNumberish;
  };

  export type LoanReviewStructOutput = [
    nft: string,
    tokenId: bigint,
    spender: string,
    token: string,
    value: bigint
  ] & {
    nft: string;
    tokenId: bigint;
    spender: string;
    token: string;
    value: bigint;
  };

  export type TokenLoanStruct = {
    exists: boolean;
    loan: BigNumberish;
    token: AddressLike;
  };

  export type TokenLoanStructOutput = [
    exists: boolean,
    loan: bigint,
    token: string
  ] & { exists: boolean; loan: bigint; token: string };
}

export interface EscrowInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "_increaseTokenAllowance"
      | "_reviewLoans"
      | "loan"
      | "lockedTokens"
      | "onERC721Received"
      | "owner"
      | "renounceOwnership"
      | "totalLoan"
      | "transferOwnership"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "OwnershipTransferred"
      | "onERC721Transfer"
      | "onReview"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "_increaseTokenAllowance",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "_reviewLoans",
    values: [Escrow.LoanReviewStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "loan",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lockedTokens",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC721Received",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalLoan",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "_increaseTokenAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "_reviewLoans",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "loan", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lockedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC721Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "totalLoan", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace onERC721TransferEvent {
  export type InputTuple = [
    nft: AddressLike,
    operator: AddressLike,
    from: AddressLike,
    tokenId: BigNumberish,
    data: BytesLike
  ];
  export type OutputTuple = [
    nft: string,
    operator: string,
    from: string,
    tokenId: bigint,
    data: string
  ];
  export interface OutputObject {
    nft: string;
    operator: string;
    from: string;
    tokenId: bigint;
    data: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace onReviewEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Escrow extends BaseContract {
  connect(runner?: ContractRunner | null): Escrow;
  waitForDeployment(): Promise<this>;

  interface: EscrowInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  _increaseTokenAllowance: TypedContractMethod<
    [token: AddressLike, spender: AddressLike, value: BigNumberish],
    [void],
    "nonpayable"
  >;

  _reviewLoans: TypedContractMethod<
    [loans: Escrow.LoanReviewStruct[]],
    [void],
    "nonpayable"
  >;

  loan: TypedContractMethod<
    [nft: AddressLike, owner: AddressLike, tokenId: BigNumberish],
    [Escrow.TokenLoanStructOutput],
    "view"
  >;

  lockedTokens: TypedContractMethod<
    [nft: AddressLike, owner: AddressLike],
    [bigint[]],
    "view"
  >;

  onERC721Received: TypedContractMethod<
    [
      operator: AddressLike,
      from: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  totalLoan: TypedContractMethod<
    [nft: AddressLike, owner: AddressLike],
    [bigint],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  withdraw: TypedContractMethod<
    [nft: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "_increaseTokenAllowance"
  ): TypedContractMethod<
    [token: AddressLike, spender: AddressLike, value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "_reviewLoans"
  ): TypedContractMethod<
    [loans: Escrow.LoanReviewStruct[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "loan"
  ): TypedContractMethod<
    [nft: AddressLike, owner: AddressLike, tokenId: BigNumberish],
    [Escrow.TokenLoanStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "lockedTokens"
  ): TypedContractMethod<
    [nft: AddressLike, owner: AddressLike],
    [bigint[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "onERC721Received"
  ): TypedContractMethod<
    [
      operator: AddressLike,
      from: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "totalLoan"
  ): TypedContractMethod<
    [nft: AddressLike, owner: AddressLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [nft: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "onERC721Transfer"
  ): TypedContractEvent<
    onERC721TransferEvent.InputTuple,
    onERC721TransferEvent.OutputTuple,
    onERC721TransferEvent.OutputObject
  >;
  getEvent(
    key: "onReview"
  ): TypedContractEvent<
    onReviewEvent.InputTuple,
    onReviewEvent.OutputTuple,
    onReviewEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "onERC721Transfer(address,address,address,uint256,bytes)": TypedContractEvent<
      onERC721TransferEvent.InputTuple,
      onERC721TransferEvent.OutputTuple,
      onERC721TransferEvent.OutputObject
    >;
    onERC721Transfer: TypedContractEvent<
      onERC721TransferEvent.InputTuple,
      onERC721TransferEvent.OutputTuple,
      onERC721TransferEvent.OutputObject
    >;

    "onReview()": TypedContractEvent<
      onReviewEvent.InputTuple,
      onReviewEvent.OutputTuple,
      onReviewEvent.OutputObject
    >;
    onReview: TypedContractEvent<
      onReviewEvent.InputTuple,
      onReviewEvent.OutputTuple,
      onReviewEvent.OutputObject
    >;
  };
}
