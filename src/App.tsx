import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import Urbit, { UrbitInterface } from "@urbit/http-api";
import "./App.css";
import { Content, GraphNode } from "@urbit/api";

const createApi = _.memoize(
  (): UrbitInterface => {
    const urb = new Urbit("http://localhost:80", "lidlut-tabwed-pillex-ridrup");
    urb.ship = "zod";
    urb.connect();
    return urb;
  }
);

const App = () => {
  const [urb, setUrb] = useState<UrbitInterface | undefined>();
  const [sub, setSub] = useState<number | undefined>();
  const [log, setLog] = useState<string>("");
  const [example, setExample] = useState<string>("");
  const callback = useCallback(setExample, [setExample]);

  const subHandler = useCallback(
    (message) => {
      if (!("add-nodes" in message["graph-update"])) return;
      const newNodes: Record<string, GraphNode> =
        message["graph-update"]["add-nodes"]["nodes"];
      let newMessage = "";
      Object.keys(newNodes).forEach((index) => {
        newNodes[index].post.contents.forEach((content: Content) => {
          if ("text" in content) {
            newMessage += content.text;
          } else if ("url" in content) {
            newMessage += content.url;
          } else if ("code" in content) {
            newMessage += content.code.expression;
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
    urb.subscribe({
      app: "chanel",
      path: "/example",
      event: callback,
    });
    console.log(urb);
  }, [urb, sub, subHandler]);

  return (
    <div className="App">
      <header className="App-header">
        <pre>Result: {log}</pre>
        <pre>{example}</pre>
      </header>
    </div>
  );
};

export default App;
