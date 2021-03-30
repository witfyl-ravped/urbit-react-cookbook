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
  Group,
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
  const [groups, setGroups] = useState<string[]>([]);

  const subHandler = useCallback(
    (message) => {
      console.log(message);
      if (!("add-nodes" in message["graph-update"])) return;
      const newNodes: Record<string, GraphNode> =
        message["graph-update"]["add-nodes"]["nodes"];
      console.log(newNodes);
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
    },
    [log]
  );

  const groupArray = useCallback(
    (groups) => {
      console.log(groups);
      setGroups(Object.keys(groups.groupUpdate.initial));
    },
    [groups]
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

  useEffect(() => {
    if (!urb || sub) return;
    urb
      .subscribe({
        app: "group-store",
        path: "/groups",
        event: groupArray,
        err: console.log,
        quit: console.log,
      })
      .then((subscriptionId) => {
        setSub(subscriptionId);
      });
  }, [urb, sub, groupArray]);

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

  function sendMessage(message: string, group: string) {
    if (!urb || !urb.ship) return;
    console.log(group);
    const post = createPost(urb.ship, [{ text: message }]);
    urb.thread(addPost("~zod", group, post));
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
            <td>
              <div style={{ justifyContent: "center" }}>
                <pre>Send Message</pre>
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
                <input
                  type="groupName"
                  name="groupName"
                  placeholder="Group Name"
                />
                <br />
                <input
                  type="description"
                  name="description"
                  placeholder="Description"
                />
                <br />
                <input type="submit" value="Create Group" />
              </form>
            </td>
            <td>
              <form
                onSubmit={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  const target = e.target as typeof e.target & {
                    message: { value: string };
                    group: { value: string };
                  };
                  const message = target.message.value;
                  const group = target.group.value;
                  sendMessage(message, group);
                }}
              >
                <select id="group" name="group">
                  <option>Select a Group</option>
                  {groups.map((group) => (
                    <option value={group}>{group}</option>
                  ))}
                </select>
                <br />
                <input type="message" name="message" placeholder="Mesage" />
                <br />
                <input type="submit" value="Send Message" />
              </form>
            </td>
          </tr>
        </table>
      </header>
    </div>
  );
};

export default App;
