import { useEffect, useState } from 'react';
import { RequestContext } from '../../../controller/global/URLValidation';
import { EntityLog, getEntityLogs } from '../../../model/LogsFetcher';
import BoolLog from './LogSymbols/BoolLog';
import NumberLog from './LogSymbols/NumberLog';
import MessageLog from './LogSymbols/MessageLog';

const LogsField = ({
  requestContext,
  entityName,
}: {
  requestContext: RequestContext;
  entityName: string;
}) => {
  const [logObject, setLogObject] = useState<{ [key: string]: EntityLog[] }>({});
  useEffect(() => {
    (async () => {
      if (
        !requestContext.accessedEntityType?.logs ||
        requestContext.accessedEntityType.logs.length == 0
      ) {
        return;
      }
      const logs = await getEntityLogs(entityName, requestContext);
      if (logs === null) {
        setLogObject({});
      } else {
        const log: { [key: string]: EntityLog[] } = {};

        for (const l of logs) {
          if (!log[l.name]) {
            log[l.name] = [];
          }
          log[l.name].push(l);
        }

        for (const key of Object.keys(log)) {
          log[key].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        }
        setLogObject(log);
      }
    })();
  }, [entityName]);

  return (
    <div
      className="flex flex-row xl:flex-wrap 2xl:flex-nowrap gap-1 w-full p-1 min-w-[120px] xl:min-w-[0px] opacity-60"
      style={{
        verticalAlign: 'middle',
      }}
    >
      {(function () {
        const jsx = [];
        if (
          !requestContext.accessedEntityType?.logs ||
          requestContext.accessedEntityType.logs.length == 0
        ) {
          return <em className="opacity-80">No Logs Defined</em>;
        }
        for (const l of requestContext.accessedEntityType.logs) {
          console.error(logObject);
          let problem = null;
          let progress = null;
          if (logObject[l.name] && logObject[l.name].length > 0) {
            problem = logObject[l.name][0].problem ?? null;
            progress = logObject[l.name][0].progress ?? null;
          }
          if (l.problem && !l.progress) {
            jsx.push(<BoolLog problem={problem} />);
          } else if (l.progress) {
            jsx.push(<NumberLog problem={problem} progress={progress} />);
          } else {
            jsx.push(<MessageLog />);
          }
        }
        return jsx;
      })()}
      {/* <CircularProgressbarWithChildren
value={90}
text={`${90}%`}
className="xl:max-w-[38px] 1.5xl:max-w-[50px] 2xl:max-w-[60px] min-w-[38px]"
styles={{
  root: {
    // maxWidth: minW,
    // maxHeight: minW,
    imageRendering: 'crisp-edges',
    transform: 'scale(1)',
  },
  path: { stroke: '#10B981' },
  text: { fontSize: 28, textRendering: 'optimizeLegibility', fill: 'black' },
}}
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="opacity-40"
  height="70%"
  viewBox="0 -960 960 960"
  fill="#10B981"
>
  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
</svg>
</CircularProgressbarWithChildren>

<CircularProgressbarWithChildren
value={90}
text={`${90}%`}
className="xl:max-w-[38px] 1.5xl:max-w-[50px] 2xl:max-w-[60px] min-w-[38px]"
styles={{
  root: {
    // maxWidth: minW,
    // maxHeight: minW,
    imageRendering: 'crisp-edges',
    transform: 'scale(1)',
  },
  path: { stroke: '#DC3545' },
  text: { fontSize: 28, textRendering: 'optimizeLegibility', fill: 'black' },
}}
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="opacity-40"
  height="70%"
  viewBox="0 -960 960 960"
  fill="#DC3545"
>
  <path d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm-80-240v-480h160v480H400Z" />
</svg>
</CircularProgressbarWithChildren>
<CircularProgressbarWithChildren
value={100}
className="xl:max-w-[38px] 1.5xl:max-w-[50px] 2xl:max-w-[60px] min-w-[38px]"
styles={{
  root: {
    // maxWidth: minW,
    // maxHeight: minW,
    imageRendering: 'crisp-edges',
    transform: 'scale(1)',
  },
  path: { stroke: '#DC3545' },
  text: { fontSize: 28, textRendering: 'optimizeLegibility', fill: 'black' },
}}
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="opacity-80"
  height="70%"
  viewBox="0 -960 960 960"
  fill="#DC3545"
>
  <path d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm-80-240v-480h160v480H400Z" />
</svg>
</CircularProgressbarWithChildren>
<CircularProgressbarWithChildren
value={100}
className="xl:max-w-[38px] 1.5xl:max-w-[50px] 2xl:max-w-[60px] min-w-[38px]"
styles={{
  root: {
    // maxWidth: minW,
    // maxHeight: minW,
    imageRendering: 'crisp-edges',
    transform: 'scale(1)',
  },
  path: { stroke: '#10B981' },
  text: { fontSize: 28, textRendering: 'optimizeLegibility', fill: 'black' },
}}
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="opacity-80"
  height="70%"
  viewBox="0 -960 960 960"
  fill="#10B981"
>
  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
</svg>
</CircularProgressbarWithChildren>

<CircularProgressbarWithChildren
// id="message"
value={100}
className="xl:max-w-[38px] 1.5xl:max-w-[50px] 2xl:max-w-[60px] min-w-[38px]"
styles={{
  root: {
    // maxWidth: minW,
    // maxHeight: minW,
    imageRendering: 'crisp-edges',
    verticalAlign: 'middle',
  },
  path: {
    stroke: `rgba(200, 200, 200)`,
  },
  text: { fontSize: 28, textRendering: 'optimizeLegibility' },
}}
>
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="opacity-50"
  height="60%"
  viewBox="0 -960 960 960"
  fill="grey"
>
  <path d="M480-680q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Zm-60 560v-480h120v480H420Z" />
</svg>
</CircularProgressbarWithChildren> */}
    </div>
  );
};

export default LogsField;
