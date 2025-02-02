/* eslint-disable @typescript-eslint/no-explicit-any */
import { showError } from '../controller/local/ErrorNotifyController';
import { navigateToURL } from '../controller/global/URLValidation';
import { RequestEditContext } from '../utils/types/internal/request';
import { Nullable } from '../utils/types/typeUtils';
import { authFailed, sendRequest } from '../utils/AuthedRequest';
import { dumpEditActions, EditActionSnapshot } from '../utils/schema/injectActions';
import { getEntityObject } from '../utils/validatorUtils';
import { ValidateResponse } from '../utils/types/internal/validation';
import { APIValidateResponse } from '../utils/types/api';

export const defaultValidationResponse: ValidateResponse = {
  json_schema: { type: 'object', required: [], properties: {} },
  ui_schema: { type: 'VerticalLayout', elements: [] },
  data: {},
  valid: false,
  detail: 'Sorry, there is no form to display (yet)...',
};

export async function getSchema(
  requestEditContext: RequestEditContext,
  editActions: EditActionSnapshot,
): Promise<ValidateResponse | null> {
  return validate(requestEditContext.entityName ?? null, {}, requestEditContext, editActions);
}

export async function validateYAML(
  requestEditContext: RequestEditContext,
  name: Nullable<string>,
  yaml_new: string,
  yaml_old?: string,
): Promise<ValidateResponse | null> {
  const url: string | null | undefined = requestEditContext.rc.yacURL;

  if (url == undefined || url == null) return null; //structuredClone(defaultValidationResponse);
  const obj = getEntityObject(requestEditContext, undefined, name, [], yaml_new, yaml_old);

  const resp: Nullable<Response> = await sendRequest(url + `/validate`, 'POST', obj);

  if (resp == null) {
    return null; //structuredClone(defaultValidationResponse);
  }

  if (resp.status == 200) {
    const dat = await resp.json();

    return {
      json_schema: dat.schemas.json_schema,
      ui_schema: dat.schemas.ui_schema,
      data: dat.schemas.data,
      valid: dat.request.valid && dat.schemas.valid,
      detail: dat.request.message ?? dat.schemas.message ?? '',
    };

    // return insertActionData(injectAction(dat, requestEditContext), editActions);
  } else if (resp.status == 422) {
    showError('Frontend Error', 'Invalid specification used, cannot talk to YAC servers.');
    return null; //structuredClone(defaultValidationResponse);
  } else if (resp.status >= 500) {
    const ans = await resp.json();
    showError(
      `${requestEditContext.rc.backendObject?.title}: ` +
        (ans.title ?? `Cannot validate YAML (Status ${resp.status})`),
      ans.message ?? 'Waking up the admin, please stand by...',
    );
    // let ret: ValidateResponse = structuredClone(defaultValidationResponse);
    // ret.detail = "Internal Server Error - no Schema to display.";
    return null; //ret;
  } else if (authFailed(resp.status)) {
    // TODO

    return null;
  }

  //let ret: ValidateResponse = structuredClone(defaultValidationResponse);
  return resp.json().then((body) => {
    showError('Cannot fetch schema', `Server responded with "${body.message}"`);
    // ret.detail = body.detail;
    return null; // ret;
  });
}

/**
 *
 * @param name
 * @param data
 * @param requestContext
 * @param originalName = null. Leave null when creating a new entity.
 * @returns
 */
export async function validate(
  name: Nullable<string>,
  data: any,
  requestEditContext: RequestEditContext,
  editActions: EditActionSnapshot,
): Promise<ValidateResponse | null> {
  const url: string | null | undefined = requestEditContext.rc.yacURL;

  if (url == undefined || url == null) return null; //structuredClone(defaultValidationResponse);
  const obj = getEntityObject(requestEditContext, data, name, dumpEditActions(editActions));

  const resp: Nullable<Response> = await sendRequest(url + `/validate`, 'POST', obj);

  if (resp == null) {
    return null; //structuredClone(defaultValidationResponse);
  }

  if (resp.status == 200) {
    const dat = (await resp.json()) as APIValidateResponse;

    return {
      json_schema: dat.schemas.json_schema,
      ui_schema: dat.schemas.ui_schema,
      data: dat.schemas.data,
      valid: dat.request.valid && dat.schemas.valid,
      detail: dat.request.message ?? dat.schemas.message ?? '',
    };

    // return insertActionData(injectAction(dat, requestEditContext), editActions);
  } else if (resp.status == 422) {
    showError('Frontend Error', 'Invalid specification used, cannot talk to YAC servers.');
    return null; //structuredClone(defaultValidationResponse);
  } else if (resp.status >= 500) {
    const ans = await resp.json();
    showError(
      `${requestEditContext.rc.backendObject?.title}: ` +
        (ans.title ?? `Cannot validate ${name} (Status ${resp.status})`),
      ans.message ?? 'Waking up the admin, please stand by...',
    );
    // let ret: ValidateResponse = structuredClone(defaultValidationResponse);
    // ret.detail = "Internal Server Error - no Schema to display.";
    return null; //ret;
  } else if (authFailed(resp.status)) {
    // TODO
    const ans = await resp.json();
    showError(ans.title, ans.message);
    navigateToURL('/');

    return null;
  }

  //let ret: ValidateResponse = structuredClone(defaultValidationResponse);
  return resp.json().then((body) => {
    showError('Cannot fetch schema', `Server responded with "${body.message}"`);
    // ret.detail = body.detail;
    return null; // ret;
  });
}
