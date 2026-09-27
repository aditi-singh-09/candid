import { CompiledContract } from "@midnight-ntwrk/midnight-js-protocol/compact-js";

export * from "./managed/survey/contract/index.js";
export * from "./witnesses";

import * as CompiledSurveyContractModule from "./managed/survey/contract/index.js";
import * as Witnesses from "./witnesses";

class ContractWrapper extends CompiledSurveyContractModule.Contract<any, any> {
  constructor() {
    super(Witnesses.witnesses);
  }
}

export const CompiledSurveyContract = CompiledContract.make(
  "survey",
  ContractWrapper as any
).pipe(
  CompiledContract.withCompiledFileAssets("./managed/survey")
) as any;
