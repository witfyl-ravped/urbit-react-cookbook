# Urbit React Cookbook

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

First run `yarn install` to install project dependencies.

Then boot a fake ~zod ship connected to localhost port 8080 (alternatively you can select a different port by editing `src/App.tsx`) For instructions on booting fake ships see [this guide](https://github.com/timlucmiptev/gall-guide/blob/62f4647b614dc201796204a0214629375a1a56bb/workflow.md).

Then run `yarn start` to boot the local React server which will run at `http://localhost:3000` by default.

In a separate browser tab connect to your fake ~zod's Landscape page which is `http://localhost:8080` or a custom port of you changed it

## Using the interface

<li>Once the React server and Urbit ship are up and running start by adding a group using the form on the left. Enter a group name, group description then press "Create Group." Your browser will confirm the successful creation with an alert window.
<li>After clicking OK in the alert window navigate to your Landscape page to confirm that the group was created and tile added.
<li>Back in the React Aoo, fill in the middle "Create Channel" inputs. Select your newly created group from the drop-down and enter a Chat Name and Description and press "Create Channel". This should also be confirmed be a window alert upon success.
<li>After clicking OK in the alert window navigate to your Landscape page to confirm that the channel was created within your previously created group.
<li>Again back in the React App, select a chat from the drop-down menu under "Send Message" and enter text. Upon clicking the "Send Message" button you should once again receive a confirmation alert.
<li>Your message should now appear at the top of the React app. You can navigate back to your Landscape window to see the message you just sent from React displayed in the newly created channel.
<li>Notice that you can send a message to the channel from Landscape and that it will also appear at the top of the React app.
