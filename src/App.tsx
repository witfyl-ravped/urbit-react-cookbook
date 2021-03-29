import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import Urbit, { UrbitInterface } from "@urbit/http-api";
import "./App.css";
import { Content, GraphNode, createGroup } from "@urbit/api";

const createApi = _.memoize(
  (): UrbitInterface => {
    const urb = new Urbit(
      "http://localhost:8080",
      "lidlut-tabwed-pillex-ridrup"
    );
    urb.ship = "zod";
    urb.onError = (message) => console.log(message);
    urb.connect();
    return urb;
  }
);

const App = () => {
  const [urb, setUrb] = useState<UrbitInterface | undefined>();
  const [sub, setSub] = useState<number | undefined>();
  const [log, setLog] = useState<string>("");
  const [example, setExample] = useState<string>("");
  // const callback = useCallback(setExample, [setExample]);

  const subHandler = useCallback(
    (message) => {
      console.log(message);
      if (!("add-nodes" in message["graph-update"])) return;
      const newNodes: Record<string, GraphNode> =
        message["graph-update"]["add-nodes"]["nodes"];
      let newMessage = "";
      Object.keys(newNodes).forEach((index) => {
        newNodes[index].post.contents.forEach((content: Content) => {
          console.log(content);
          if ("text" in content) {
            newMessage += content.text + " ";
          } else if ("url" in content) {
            newMessage += content.url + " ";
          } else if ("code" in content) {
            newMessage += content.code.expression;
          } else if ("mention" in content) {
            newMessage += "~" + content.mention + " ";
          }
        });
      });
      setLog(`${log}\n${newMessage}`);
      console.log("log");
    },
    [log]
  );

  useEffect(() => {
    const _urb = createApi();
    setUrb(_urb);
    return () => {};
  }, [setUrb]);

  useEffect(() => {
    if (!urb || sub) return;
    urb
      .subscribe({
        app: "graph-store",
        path: "/updates",
        event: subHandler,
        err: console.log,
        quit: console.log,
      })
      .then((subscriptionId) => {
        setSub(subscriptionId);
      });
    console.log(urb);
  }, [urb, sub, subHandler]);

  // const createGroup = () => {
  //   if (!urb) return;
  //   urb.thread({
  //     inputMark: "group-view-action",
  //     outputMark: "json",
  //     threadName: "group-create",
  //     body: {
  //       create: {
  //         name: "test-channel-2",
  //         policy: {
  //           open: {
  //             banRanks: [],
  //             banned: [],
  //           },
  //         },
  //         title: "Test Channel 2",
  //         description: "Testing channel 2",
  //       },
  //     },
  //   });
  // };

  const createGroupLocal = () => {
    createGroup(
      "test-channel-2",
      {
        open: {
          banRanks: [],
          banned: [],
        },
      },
      "Test Channel 2",
      "Testing Channel 2"
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <pre>Result: {log}</pre>
        <pre>String from Hoon:{example}</pre>
        <pre>
          <button onClick={createGroupLocal}>Create Group</button>
        </pre>
      </header>
    </div>
  );
};

export default App;
