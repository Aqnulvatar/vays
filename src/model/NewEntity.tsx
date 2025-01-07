import { RequestContext } from '../controller/global/URLValidation';
import { showError } from '../controller/local/ErrorNotifyController';
import { actions2URLQuery } from '../utils/actionUtils';
import { sendRequest } from '../utils/AuthedRequest';
import { Nullable } from '../utils/typeUtils';
import { ActionDecl } from './EntityListFetcher';

export async function copyEntity(
  entityName: string,
  copyEntityName: string,
  actions: ActionDecl[],
  requestContext: RequestContext,
) {
  const url: string | null | undefined = requestContext.yacURL;

  if (url == undefined || url == null) return false;

  const resp: Nullable<Response> = await sendRequest(
    url + `/entity/${requestContext.entityTypeName}${actions2URLQuery(actions)}`,
    'POST',
    JSON.stringify({ name: entityName, copy: copyEntityName }),
  );
  if (resp == null) return false;

  if (resp?.status == 201) return true;
  if (resp?.status >= 400) {
    const ans = await resp.json();
    showError(
      `${requestContext.backendObject?.title}: ` +
        (ans.title ?? `Cannot Copy ${entityName} (Status ${resp.status})`),
      ans.message ?? 'Waking up the admin, please stand by...',
    );
    return null;
  }
  return false;
}

export async function linkEntity(
  entityName: string,
  copyEntityName: string,
  actions: ActionDecl[],
  requestContext: RequestContext,
) {
  const url: string | null | undefined = requestContext.yacURL;

  if (url == undefined || url == null) return false;

  const resp: Nullable<Response> = await sendRequest(
    url + `/entity/${requestContext.entityTypeName}${actions2URLQuery(actions)}`,
    'POST',
    JSON.stringify({ name: entityName, link: copyEntityName }),
  );
  if (resp == null) return false;

  if (resp?.status == 201) return true;
  if (resp?.status >= 400) {
    const ans = await resp.json();
    showError(
      `${requestContext.backendObject?.title}: ` +
        (ans.title ?? `Cannot Link ${entityName} (Status ${resp.status})`),
      ans.message ?? 'Waking up the admin, please stand by...',
    );
    return null;
  }

  return false;
}
