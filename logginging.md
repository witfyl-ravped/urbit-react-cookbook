# Logging in

There are different ways that you could set up the login flow for connecting to an Urbit ship through JS. Notice that in this example we are not keeping all the code in one file, this is to serve as a reference more than recommended architecture for a functional app. With that in mind, we'll be using a very simple method to allow a user to login to their ship and store their login credentials in localStorage for ease.

```
const createApi = (host: string, code: string) =>
  _.memoize(
    (): UrbitInterface => {
      const urb = new Urbit(host, code);
      urb.ship = "zod";
      urb.onError = (message) => console.log(message);
      urb.connect();
      return urb;
    }
  );
```

It starts with a function we'll call `createApi` outside of our main `App()` function. While this tutorial does it's best to be self-contained notice here that we are using the `memoize` method courtesy of lodash. This essentially caches the result of the function to reduce the amount of expensive computation our app has to do.

Next thing to notice is that we're using two imports from `@urbit/http-api`. `UrbitInterface` is is a TypeScript interface that lives in `@urbit/http-api/dist/types.d.s` Read it's source to see the methods and variables it contains. We are passing it a variable called `urb` that will hold an `Urbit` object (which lives in `@urbit/http-api/dist/Urbit.d.ts`). The `Urbit` object itself accepts a `host` url and a ship `code`. The `host` is the port on `localhost` that our Urbit uses to interact with the web, and the `code` is the authentication code that we can use to open this connection. Once we pass in the `urb` object we can now call methods such as `.connect()` which establishes our connection to our ship. Refer to the rest of `UrbitInterface` to see other calls we will make in this tutorial, especially `poke` `thread` `scry` and `subscribe`, these are the four ways we will interact with our ship.
