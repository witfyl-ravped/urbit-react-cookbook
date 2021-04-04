# Urbit React Cookbook

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

First run `yarn install` to install project dependencies.

Then boot a fake `~zod` ship connected to localhost port 8080 (alternatively you can select a different port by editing `src/App.tsx`) For instructions on booting fake ships see [this guide](https://github.com/timlucmiptev/gall-guide/blob/62f4647b614dc201796204a0214629375a1a56bb/workflow.md).

Then run `yarn start` to boot the local React server which will run at `http://localhost:3000` by default.

In a separate browser tab connect to your fake `~zod`'s Landscape page which is `http://localhost:8080` or a custom port of you changed it

Once the React server and Urbit ship are up and running enter `+cors-registry` in your ship's dojo. You will likely see the following URL in the `requests` entry:

`~~http~3a.~2f.~2f.localhost~3a.3000`

You'll need to add it to the approved list by running:

`|cors-approve ~~http~3a.~2f.~2f.localhost~3a.3000`

Verfiy this command worked by running `+cors-registry` again.

## Using the interface

###### Creating Groups

<li>Start by adding a group using the form on the left of the React app. Enter a Group Name, Group Description and press "Create Group." Your browser will confirm the successful creation with an alert window.<br>
<li>After clicking OK in the alert window navigate to your Landscape tab to confirm that the group was created and it's tile added.<br>

###### Creating Channels

<li>Back in the React app, fill in the middle "Create Channel" inputs. Select your newly created group from the drop-down and enter a Chat Name and Description and press "Create Channel". This should also be confirmed by a window alert upon success.<br>
<li>After clicking OK in the alert window navigate to your Landscape page to confirm that the channel was created within your previously created group.<br>

###### Sending Messages

<li>Again back in the React app, select a chat from the drop-down menu under "Send Message" and enter some text. Upon clicking the "Send Message" button you should once again receive a confirmation alert.<br>
<li>Your message should now appear at the top of the React app. You can navigate back to your Landscape window to see the message you just sent from React displayed in the newly created channel.<br>
<li>Notice that you can send a message to the channel from Landscape and that it will also appear at the top of the React app.<br>

###### Removing Channels

<li>To test this function start by adding a new channel under the Create Channel heading.<br>
<li>Verify that it has been added by checking in Landscape. You can also test it by selecting it from the "Select a Channel" dropdown selector under the "Send Message" header.<br>
<li>Now select your newly added channel from the "Select a Channel" dropdown under the "Remove Channel" header.<br>
<li>Confirm the pop and then verify the channel has been removed from both the drop down menus and your Landscape tab.<br>

###### Removing Groups

<li>The reason you created a second channel in the example above is to show that removing a group will also remove its channels.<br>
<li>Choose your group from "Select a Group" dropdown under the "Remove Group" header and click "Remove Group".<br>
<li>Click OK and verify that the group and its tile has been removed from Landscape.<br>
<li>Also verify that the channel it contained is no longer listed in either of the "Select a Channel" drop down menus.<br>
