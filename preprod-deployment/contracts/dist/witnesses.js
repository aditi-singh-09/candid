export const createSurveyPrivateState = (respondentSecret, merklePath, pathDirections, hasComment) => ({
    respondentSecret,
    merklePath: (merklePath ?? Array(10).fill(new Uint8Array(32))),
    pathDirections: (pathDirections ?? Array(10).fill(false)),
    hasComment: hasComment ?? false,
});
export const witnesses = {
    respondentSecret: ({ privateState, }) => [privateState, privateState.respondentSecret],
    merklePath: ({ privateState, }) => [privateState, privateState.merklePath],
    pathDirections: ({ privateState, }) => [privateState, privateState.pathDirections],
    hasComment: ({ privateState, }) => [privateState, privateState.hasComment],
};
//# sourceMappingURL=witnesses.js.map