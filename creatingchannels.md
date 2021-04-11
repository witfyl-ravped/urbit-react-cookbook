# Creating Channels

Interestingly enough, before we start talking about creating channels we actually have to cover subscribing and storing groups. This is because a channel has to live inside of a group and in order for our users to specify which group they want their channels to live in, they need to know what groups exist in our ship.

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

## Subscribing to Groups

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

See the breakout lesson on Hooks for more details on `useEffect`, but for now you just need to know that `useEffect` will run actions after the initial render is complete. The initial render will create our state instance of `urb` described in the [Logging In](https://github.com/witfyl-ravped/urbit-react-cookbook/blob/main/logginging.md) lesson and now we can leverage `useEffect` to setup a subscription to it.

We confirm it was setup properly by running the `if(!urb)` check, then proceed to call `.subscribe()` directly on our `urb`. By digging into the types library in `@urbit/http` we see that `subscribe` takes a `SubscriptionRequestInterface` (defined in `@urbit/http-api/dist/types.d.ts` as an `app` and a `path` along with the ability to log `err` and `quit` return messages and pass a callback function via `event`).

The `subscribe` parameters are pretty straightforward. We're creating a subscription to `group-store` on path `/groups`. Then we're passing in the function `handleGroups` which we will look at in a moment, and `console.log`ing `err` and `quit` messages. Since `subscribe` returns a promise we can then use `.then()` to send our `sub` state variable the subscription id that we get back.

Finally we pass in an array as a second argument that will re-subscribe if any of it's contents change.

Now let's jump back up to line 124 where we define the `handleGroups` callback function:

```
  const handleGroups = useCallback(
    (groups) => {
      const groupsArray: GroupWName[] = [];
      Object.keys(groups.groupUpdate.initial).forEach((key) => {
        groupsArray.push({ name: key, group: groups.groupUpdate.initial[key] });
      });
      setGroups(groupsArray);
    },
    [groups]
  );
```

Here we use the `useCallback` hook, structured very similarly to `useEffect`. We start by assigning `groups`to the data we get back from `subscribe`. Then we make an array of our customer interface `GroupWName`. We use the custom interface because the `groups` object returned by `subscribe` uses the group name as the key for the rest of the group data. So we push a custom object into `groupsArray` that extracts the group name and pairs it with the rest of the `group` object info. We'll see later that we now have easy access to all of each group's data.

We then set our state `groups` variable equal to our new array and then use the second argument of `useCallback` to re-render if `groups` changes.
