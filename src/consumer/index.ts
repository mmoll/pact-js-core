import { getFfiLib } from '../ffi';
import { convertString } from '../ffi/internals';
import {
  CREATE_MOCK_SERVER_ERRORS,
  FfiSpecificationVersion,
  FfiWritePactResponse,
  INTERACTION_PART_REQUEST,
  INTERACTION_PART_RESPONSE,
} from '../ffi/types';
import logger, {
  getLogLevel,
  logCrashAndThrow,
  logErrorAndThrow,
} from '../logger';
import { wrapAllWithCheck, wrapWithCheck } from './checkErrors';

import {
  ConsumerInteraction,
  ConsumerPact,
  MatchingResult,
  Mismatch,
} from './types';

type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
interface JsonMap {
  [key: string]: AnyJson;
}
type JsonArray = Array<AnyJson>;

export const makeConsumerPact = (
  consumer: string,
  provider: string,
  version: FfiSpecificationVersion,
  logLevel = getLogLevel()
): ConsumerPact => {
  const lib = getFfiLib(logLevel);

  const pactPtr = lib.pactffi_new_pact(
    convertString(consumer),
    convertString(provider)
  );
  if (!lib.pactffi_with_specification(pactPtr, version)) {
    throw new Error(
      `Unable to set core spec version. The pact FfiSpecificationVersion '${version}' may be invalid (note this is not the same as the pact spec version)`
    );
  }

  return {
    createMockServer: (
      address: string,
      requestedPort?: number,
      tls = false
    ) => {
      const port = lib.pactffi_create_mock_server_for_pact(
        pactPtr,
        convertString(`${address}:${requestedPort ? requestedPort : 0}`),
        tls
      );
      const error: keyof typeof CREATE_MOCK_SERVER_ERRORS | undefined =
        Object.keys(CREATE_MOCK_SERVER_ERRORS).find(
          (key) => CREATE_MOCK_SERVER_ERRORS[key] === port
        ) as keyof typeof CREATE_MOCK_SERVER_ERRORS;
      if (error) {
        if (error === 'ADDRESS_NOT_VALID') {
          logErrorAndThrow(
            `Unable to start mock server at '${address}'. Is the address and port valid?`
          );
        }
        if (error === 'TLS_CONFIG') {
          logErrorAndThrow(
            `Unable to create TLS configuration with self-signed certificate`
          );
        }
        logCrashAndThrow(
          `The pact core couldn\'t create the mock server because of an error described by '${error}'`
        );
      }
      if (port <= 0) {
        logCrashAndThrow(
          `The pact core returned an unhandled error code '${port}'`
        );
      }
      logger.info(`Spun up pact mock at port ${port}`);
      return port;
    },

    mockServerMatchedSuccessfully: (port: number) => {
      return lib.pactffi_mock_server_matched(port);
    },
    mockServerMismatches: (port: number): MatchingResult[] => {
      const results: MatchingResult[] = JSON.parse(
        '[]'
        /* lib.pactffi_mock_server_mismatches(port).toString() */
      );
      return results.map((result: MatchingResult) => ({
        ...result,
        ...('mismatches' in result
          ? {
              mismatches: result.mismatches.map((m: string | Mismatch) =>
                typeof m === 'string' ? JSON.parse(m) : m
              ),
            }
          : {}),
      }));
    },
    cleanupMockServer: (port: number): boolean => {
      return wrapWithCheck<(port: number) => boolean>(
        (port: number): boolean => lib.pactffi_cleanup_mock_server(port),
        'cleanupMockServer'
      )(port);
    },
    writePactFile: (port: number, dir: string, merge = true) => {
      const result = lib.pactffi_write_pact_file(
        port,
        convertString(dir),
        !merge
      );
      switch (result) {
        case FfiWritePactResponse.SUCCESS:
          return;
        case FfiWritePactResponse.UNABLE_TO_WRITE_PACT_FILE:
          logErrorAndThrow('The pact core was unable to write the pact file');
        case FfiWritePactResponse.GENERAL_PANIC:
          logCrashAndThrow(
            'The pact core panicked while writing the pact file'
          );
        case FfiWritePactResponse.MOCK_SERVER_NOT_FOUND:
          logCrashAndThrow(
            'The pact core was asked to write a pact file from a mock server that appears not to exist'
          );
        default:
          logCrashAndThrow(
            `The pact core returned an unknown error code (${result}) instead of writing the pact`
          );
      }
    },
    newInteraction: (description: string): ConsumerInteraction => {
      const interactionPtr = lib.pactffi_new_interaction(
        pactPtr,
        convertString(description)
      );
      return wrapAllWithCheck<ConsumerInteraction>({
        uponReceiving: (description: string) => {
          return lib.pactffi_upon_receiving(
            interactionPtr,
            convertString(description)
          );
        },
        given: (state: string) => {
          return lib.pactffi_given(interactionPtr, convertString(state));
        },
        withRequest: (method: string, path: string) => {
          return lib.pactffi_with_request(
            interactionPtr,
            convertString(method),
            convertString(path)
          );
        },
        withQuery: (name: string, index: number, value: string) => {
          return lib.pactffi_with_query_parameter(
            interactionPtr,
            convertString(name),
            index,
            convertString(value)
          );
        },
        withRequestHeader: (name: string, index: number, value: string) => {
          return lib.pactffi_with_header(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            convertString(name),
            index,
            convertString(value)
          );
        },
        withRequestBody: (body: string, contentType: string) => {
          return lib.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_REQUEST,
            convertString(contentType),
            convertString(body)
          );
        },
        withResponseHeader: (name: string, index: number, value: string) => {
          return lib.pactffi_with_header(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            convertString(name),
            index,
            convertString(value)
          );
        },
        withResponseBody: (body: string, contentType: string) => {
          return lib.pactffi_with_body(
            interactionPtr,
            INTERACTION_PART_RESPONSE,
            convertString(contentType),
            convertString(body)
          );
        },
        withStatus: (status: number) => {
          return lib.pactffi_response_status(interactionPtr, status);
        },
      });
    },
  };
};
