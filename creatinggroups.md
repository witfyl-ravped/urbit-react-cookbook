# Creating Groups

## Storing Groups in State

On line 49 we create a state variable that will store an array of Group Names

`const [groups, setGroups] = useState<GroupWName[]>([]);`

Notice that we don't import `GroupWName` this is a custom type interface I made that will allow us to easily access the name of a group and alongside its details.

This is defined on line 119. It consists of a `name` string and a group `Group` which you can see in our imports from `@urbit/api"` at the top of `App.tsx` There are other ways you could store this data but I wanted to include this as a simple example of rolling your own interfaces should you need to.

```
  interface GroupWName {
    name: string;
    group: Group;
  }
```

Skipping down to line 157 we see:

```
  useEffect(() => {
    if (!urb || sub) return;
    urb
      .subscribe({
        app: "group-store",
        path: "/groups",
        event: handleGroups,
        err: console.log,
        quit: console.log,
      })
      .then((subscriptionId) => {
        setSub(subscriptionId);
      });
  }, [urb, sub, handleGroups]);
```

See the breakout lesson on Hooks for more details on `useEffect`, but for now you just need to know that `useEffect` will run actions after the initial render is complete. The initial render will create our state instance of `urb` described in the "Logging In" lesson and now we can leverage `useEffect` to setup a subscription to it.

We confirm it was setup properly by running the `if(!urb)` check, then proceed to call `.subscribe()` directly on our `urb`. By digging into the types library in `@urbit/http` we see that `subscribe` takes a `SubscriptionRequestInterface` (defined in `@urbit/http-api/dist/types.d.ts` as an `app` and a `path` along with the ability to log `err` and `quit` return messages and pass a callback function via `event`).
