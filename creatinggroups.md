# Creating Groups

## Parsing User Data

Let's start by looking at how we will parse our users' input in order to create a group on our ship, and then we'll look at the UI we use to collect said data.

We'll make a brief mention of line 188:

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

## UI to Collect User Input

Now we're ready to render the UI that will allow users to name their groups and add a description on line 468:

```
<form
    onSubmit={(e: React.SyntheticEvent) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
        groupName: { value: string };
        description: { value: string };
    };
        {/* We're just creating variables from the input fields defined below, createGroupLocal handles the formatting */}

        const groupName = target.groupName.value;
        const description = target.description.value;
        createGroupLocal(groupName, description);
    }}>
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
```

You'll notice this is the same pattern as we saw in the [Logging In](https://github.com/witfyl-ravped/urbit-react-cookbook/blob/main/logginging.md) lesson. Namely we use the `onSubmit` prop to create an object from our two input fields (in this case group name and description), and then we destructure those values into variables that we pass into our `createGroupLocal()` function described above.
