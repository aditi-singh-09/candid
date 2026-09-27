import { Ledger } from "./managed/survey/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
export type SurveyPrivateState = {
    readonly respondentSecret: Uint8Array;
    readonly merklePath: [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array];
    readonly pathDirections: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
    readonly hasComment: boolean;
};
export declare const createSurveyPrivateState: (respondentSecret: Uint8Array, merklePath?: Uint8Array[], pathDirections?: boolean[], hasComment?: boolean) => SurveyPrivateState;
export declare const witnesses: {
    respondentSecret: ({ privateState, }: WitnessContext<Ledger, SurveyPrivateState>) => [SurveyPrivateState, Uint8Array];
    merklePath: ({ privateState, }: WitnessContext<Ledger, SurveyPrivateState>) => [SurveyPrivateState, [Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array, Uint8Array]];
    pathDirections: ({ privateState, }: WitnessContext<Ledger, SurveyPrivateState>) => [SurveyPrivateState, [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean]];
    hasComment: ({ privateState, }: WitnessContext<Ledger, SurveyPrivateState>) => [SurveyPrivateState, boolean];
};
