#include <napi.h>

Napi::Value PactffiVerifierNewForApplication(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierExecute(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierShutdown(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierSetProviderInfo(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierSetFilterInfo(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierSetProviderState(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierSetVerificationOptions(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierSetPublishOptions(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierSetConsumerFilters(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierAddCustomHeader(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierAddFileSource(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierAddDirectorySource(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierUrlSource(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierBrokerSource(const Napi::CallbackInfo& info);
Napi::Value PactffiVerifierBrokerSourceWithSelectors(const Napi::CallbackInfo& info);
// Unimplemented
// Napi::Value PactffiVerifierShutdown(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierNewForApplication(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierNew(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierShutdown(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierNewForApplication(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierShutdown(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierSetProviderInfo(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierSetFilterInfo(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierSetProviderState(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierSetVerificationOptions(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierSetConsumerFilters(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierAddFileSource(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierAddDirectorySource(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierUrlSource(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierBrokerSource(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierBrokerSourceWithSelectors(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierExecute(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierCliArgs(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierLogs(const Napi::CallbackInfo& info);
// Napi::Value PactffiVerifierLogsForProvider(const Napi::CallbackInfo& info);