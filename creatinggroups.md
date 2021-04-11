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

See the breakout lesson on Hooks for more details on `useEffect`, but for now you just need to know that `useEffect` will run actions after the initial render is complete. The initial render will create our state instance of `urb` described in the "Logging In" lesson and now we can leverage `useEffect` to setup a subscription to it.

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

The next part of our app that deals with creating groups is line 188:

```
  function formatGroupName(name: string) {
    return name
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  }
```

Landscape coerces group names into kebab format so this is just us rolling our own function here. We'll use it later.

Line 197 we make a function to create a group from the user input which we will collect below. We're calling it `createGroupLocal` to distinguish it from the `@urbit/api` function `createGroup`:

```
  function createGroupLocal(groupName: string, description: string) {
  if (!urb) return;
  urb.thread(
    // Notice that unlike subscriptions, we pass a formatting function into our thread function. In this case it is createGroup
    // I'm using default values for the 'open' object but you can create a UI to allow users to input custom values.
    createGroup(
      // The name variable stays under the hood and we use our helper format function to create it from the groupName
      formatGroupName(groupName),
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
  window.confirm(`Created group ${groupName}`);
  window.location.reload();
}
```

First we make sure `urb` is set up by running `if(!urb) return`, TypeScript forces us to check this as well otherwise it returns an error that `urb` might be null. Similar to `.subscribe` above, we now call `.thread` directly on our `urb` object. But here we need to add an additional formatting function `createGroup` which we import from `@urbit/api`.

The first argument we pass uses the kebab formatting function we made above. For simplicities sake I'm leaving the default policy values but of course you can customize those as well. Then we pass in `groupName` and `description`. Again we will be collecting all of this info below.

Finally we add a little pop-up to `confirm` that the group was created, and then a reload function to populate the rest of the UI. If we were using functional components this re-render would happen automatically, or perhaps I'm missing a way to update the `urb` object to cause a re-render. Please let me know if so.
