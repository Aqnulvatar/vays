import _ from 'lodash';
import { stringify } from 'yaml';

import editingState from '../controller/state/EditCtrlState';
import { ValidateResponse } from '../model/ValidatorClient';
import { logError } from '../utils/logger';
import { JsonSchema } from '@jsonforms/core';
import { showError } from '../controller/local/ErrorNotifyController';
import { navigateToURL } from '../controller/global/URLValidation';

/**
 * Retunrs whether the data has been removed.
 * @param newDefault
 * @param oldDefault
 * @param oldObject
 */
function _refreshDefaults(
  newDefault: Readonly<any>,
  oldDefault: Readonly<any>,
  oldObject: any,
): {
  removedData: boolean;
  modified: boolean;
} {
  // So far ignores additions of new defaults (i.e. in newDeault, not in oldDef)
  let remSym = false;
  let mod = false;
  for (const key of Object.keys(oldDefault)) {
    if (!(key in newDefault)) {
      remSym = true;
      mod = true;
      delete oldObject[key];
    } else if (!(key in oldObject)) {
      continue;
    } else if (typeof oldObject[key] === 'object' && oldObject[key] != null) {
      const ret = _refreshDefaults(newDefault[key], oldDefault[key], oldObject[key]);
      remSym ||= ret.removedData;
      mod ||= ret.modified;
      // Changing the default value
    } else if (!_.isEqual(oldDefault[key], newDefault[key])) {
      oldObject[key] = _.clone(newDefault[key]);
      mod = true;
    }
  }

  for (const key of Object.keys(newDefault)) {
    if (!(key in oldDefault)) {
      // Adding new default value
      oldObject[key] = _.clone(newDefault[key]);
      mod = true;
    }
  }

  return { removedData: remSym, modified: mod };
}

/**
 * Adds the new parameter defaults, modifies existing ones
 * if needed and removes no longer present ones.
 * @param valResp
 * @returns Whether the data has been changed.
 */
export function updateDefaults(valResp: ValidateResponse): boolean {
  if (editingState.previousDefaultsObject == null) {
    logError(
      'Controller internal state invariant violated: previousDefaults is null',
      'EditController/updateDefaults',
    );
    return false;
  }

  let newDefault = {};
  try {
    const validate = editingState.ajv.compile(valResp.json_schema);
    validate(newDefault);
  } catch (e: any) {
    showError('Faulty YAC Config: Schema Error', e.toString());
    navigateToURL('/');
  }

  console.log('The updated');
  console.log(newDefault);
  console.log(editingState.previousDefaultsObject);
  console.log(valResp.data);
  const ret = _refreshDefaults(newDefault, editingState.previousDefaultsObject, valResp.data);
  if (ret.removedData) {
    // Forces removal of the keyword below and thus revalidation of the data
    // Thus you get updated yac response
    // TODO: Maybe internal revalidate rather than this, this is hacky
    valResp.data['never_used_keyword_91323-24234'] = true;
  }
  editingState.previousDefaultsObject = newDefault;
  return ret.modified && !ret.removedData; // if remove data then there is a refresh anyways.
}

/**
 *
 * @param valResp The validation response which includes the JSON schema and the data.
 */
export function insertDefaults(valResp: ValidateResponse) {
  const data = {}; //valResp.data;

  try {
    const validate = editingState.ajv.compile(valResp.json_schema);
    validate(data);
  } catch (e: any) {
    showError('Faulty YAC Config: Schema Error', e.toString());
    navigateToURL('/');
  }

  editingState.previousDefaultsObject = structuredClone(data);
  valResp.data = data;
}

export function mergeDefaults(valResp: ValidateResponse): boolean {
  const defaults = {}; //structuredClone(valResp.data);
  try {
    const validate = editingState.ajv.compile(valResp.json_schema);
    validate(defaults);
  } catch (e: any) {
    showError('Faulty YAC Config: Schema Error', e.toString());
    navigateToURL('/');
  }

  console.log(JSON.stringify(valResp.data));
  const mergeResult = _.merge(defaults, valResp.data);
  const isEqual = _.isEqual(mergeResult, valResp.data);

  valResp.data = mergeResult;
  return !isEqual;
}

export function getDefaultsAsYAML(json_schema: JsonSchema): string {
  const defaults = {};
  editingState.ajv.compile(json_schema)(defaults);
  return `---\n# Automatically generated by VAYS\n\n${stringify(defaults)}`;
}
