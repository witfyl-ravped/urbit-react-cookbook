import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import Urbit, { UrbitInterface } from "@urbit/http-api";
import "./App.css";
import {
  Content,
  GraphNode,
  createGroup,
  createPost,
  addPost,
  TextContent,
} from "@urbit/api";

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

  function createGroupLocal(groupName: string, description: string) {
    if (!urb) return;
    urb.thread(
      createGroup(
        groupName
          .replace(/([a-z])([A-Z])/g, "$1-$2")
          .replace(/\s+/g, "-")
          .toLowerCase(),
        {
          open: {
            banRanks: [],
            banned: [],
          },
        },
        groupName,
        description
      )
    );
  }

  function sendMessage() {
    if (!urb || !urb.ship) return;
    const post = createPost(urb.ship, [{ text: "example text" }]);
    urb.thread(addPost("~zod", "testing-channel-1161", post));
  }

  return (
    <div className="App">
      <header className="App-header">
        <pre>Result: {log}</pre>
        <table width="100%">
          <tr>
            <td>
              <div style={{ justifyContent: "center" }}>
                <pre>Create Group</pre>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <form
                onSubmit={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  const target = e.target as typeof e.target & {
                    groupName: { value: string };
                    description: { value: string };
                  };
                  const groupName = target.groupName.value;
                  const description = target.description.value;
                  createGroupLocal(groupName, description);
                }}
              >
                <label>
                  <input
                    type="groupName"
                    name="groupName"
                    placeholder="Group Name"
                  />
                </label>
                <br />
                <label>
                  <input
                    type="description"
                    name="description"
                    placeholder="Description"
                  />
                </label>
                <br />
                <input type="submit" value="Submit" />
              </form>
            </td>
            <td>
              <input />
              <br />
              <button onClick={sendMessage}>Send Message</button>
            </td>
          </tr>
        </table>
      </header>
    </div>
  );
};

export default App;
