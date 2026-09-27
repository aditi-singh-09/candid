import { Ledger } from "./managed/survey/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type SurveyPrivateState = {
  readonly respondentSecret: Uint8Array;
  readonly merklePath: [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array];
  readonly pathDirections: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
  readonly hasComment: boolean;
};

export const createSurveyPrivateState = (
  respondentSecret: Uint8Array,
  merklePath?: Uint8Array[],
  pathDirections?: boolean[],
  hasComment?: boolean
): SurveyPrivateState => ({
  respondentSecret,
  merklePath: (merklePath ?? Array(10).fill(new Uint8Array(32))) as SurveyPrivateState["merklePath"],
  pathDirections: (pathDirections ?? Array(10).fill(false)) as SurveyPrivateState["pathDirections"],
  hasComment: hasComment ?? false,
});

export const witnesses = {
  respondentSecret: ({
    privateState,
  }: WitnessContext<Ledger, SurveyPrivateState>): [SurveyPrivateState, Uint8Array] =>
    [privateState, privateState.respondentSecret],

  merklePath: ({
    privateState,
  }: WitnessContext<Ledger, SurveyPrivateState>): [
    SurveyPrivateState,
    [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]
  ] => [privateState, privateState.merklePath],

  pathDirections: ({
    privateState,
  }: WitnessContext<Ledger, SurveyPrivateState>): [
    SurveyPrivateState,
    [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]
  ] => [privateState, privateState.pathDirections],

  hasComment: ({
    privateState,
  }: WitnessContext<Ledger, SurveyPrivateState>): [SurveyPrivateState, boolean] =>
    [privateState, privateState.hasComment],
};
