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
