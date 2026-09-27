import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  respondentSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  merklePath(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array[]];
  pathDirections(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, boolean[]];
  hasComment(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, boolean];
}

export type ImpureCircuits<PS> = {
  openSurvey(context: __compactRuntime.CircuitContext<PS>,
             title_0: string,
             root_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  submitFeedback(context: __compactRuntime.CircuitContext<PS>, rating_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  closeSurvey(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type ProvableCircuits<PS> = {
  openSurvey(context: __compactRuntime.CircuitContext<PS>,
             title_0: string,
             root_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  submitFeedback(context: __compactRuntime.CircuitContext<PS>, rating_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  closeSurvey(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  openSurvey(context: __compactRuntime.CircuitContext<PS>,
             title_0: string,
             root_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  submitFeedback(context: __compactRuntime.CircuitContext<PS>, rating_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  closeSurvey(context: __compactRuntime.CircuitContext<PS>): Promise<__compactRuntime.CircuitResults<PS, []>>;
}

export type Ledger = {
  readonly surveyTitle: string;
  ratingTally: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  readonly commentCount: bigint;
  usedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  readonly eligibilityRoot: Uint8Array;
  readonly isOpen: boolean;
  readonly totalResponses: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
