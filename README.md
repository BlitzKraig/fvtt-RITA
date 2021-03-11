# RITA for FVTT

![RITA Release](https://github.com/BlitzKraig/fvtt-RITA/workflows/RITA%20Release/badge.svg)
![Latest Release Download Count](https://img.shields.io/github/downloads/BlitzKraig/fvtt-RITA/latest/rita-release.zip)

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q01YIEJ)

## What is it?

RITA is a voice-activated assistant for FVTT.

**RITA is still pretty basic! I'm releasing the module now in the hopes I can receive some feedback. What do you think RITA should be able to do that she can't? What can be improved? Please leave a ticket on the Issues page if you have any ideas.**

You can ask RITA to describe items, spawn tokens, execute macros and more.

RITA has a `Hook` to allow other developers to easily add functionality into their modules.

Further documentation follows this large warning...


## Important note for servers accessed over HTTP/IP

Chrome and Firefox will not ask you to grant microphone permissions if you do not have an SSL enabled site, they will just refuse automatically, breaking the module.

An easy fix is to use `localhost` to access Foundry if possible.

If this is not possible due to external hosting etc., I have discovered a workaround for Chrome, and a slightly worse workaround for Firefox.

## *PROCEED AT YOUR OWN RISK*

These workarounds should be safe, but I am not a security expert.
I would advise running via localhost, or setting up SSL for your server.

## Chrome (Secure-ish workaround)

* Navigate to `chrome://flags/#unsafely-treat-insecure-origin-as-secure`
* Enable the flag and add your foundry IP and port: `http://ip.address.here:30000`
* Relaunch, and Chrome should now ask for voice permissions

## Firefox (Less secure workaround)

* Navigate to `about:config`
* Search for `insecure`
* Set `media.devices.insecure.enabled` to `true`
* Set `media.getusermedia.insecure.enabled` to `true`
* Refresh foundry page, Firefox will now ask for mic permission

## The difference

Chrome lets you whitelist the server directly, meaning the security holes this potentially exposes can't be taken advantage of by other insecure sites.
Firefox only lets you blanket allow insecure `getusermedia` and `devices`, meaning an insecure site could theoretically try to take advantage of this.

Because they are both permissions-based, you need to actually allow the site to use them, so the risk is pretty low. HOWEVER, **you do this at your own risk!**
I would advise looking into setting up an HTTPS foundry server.

**Now that's out of the way, on to the module!**

## Who is RITA?

Rita stands for Rudimentary Interactive Tabletop Assistant. It is an effort to answer the question "Can I make a module that will let you actually talk to Foundry?".

I will refer to Rita as she/her in this Readme, as the module uses a female TTS voice on my machine.

This can be changed in module settings, along with her name, so your assistant can be a he, she, they or it.

## Talking to RITA

Rita will respond to your queries when you speak her name.

By default, her name is Rita. You can change this in the module settings.

Start your query by saying "Rita,", "Ok Rita," or "Hello Rita,", followed by your request. If you change Rita's name, the name you use to talk to her will change with it.

You can also use Push To Talk if you don't like saying the name every time.

By default, Insert is the PTT key. This can be changed in settings. You should hear an audio cue when PTT is activated. You should keep holding the PTT key until Rita responds (something I need to improve soon)

## Listening to RITA

Rita will talk back!

You can change her voice in settings, or disable it entirely.

She can output to chat, Text-To-Speech or both.

Some of Rita's chat output is enriched with functionality, so try clicking around.

If you don't want Rita to talk back for a particular request, ask her to "quietly" perform your command. (e.g. "Rita, quietly describe longbow");

If you need her to stop talking, say "Rita, stop"

## What can RITA do?

You can ask Rita to "list your commands" to get a full list of the currently registered commands.

If chat is enabled, she will output a list with headers referencing where the commands come from. This means if any modules add their own commands via the hook, you'll see them here.

Below is a list of Rita's commands (current as of 2021/03/11).

Words in parentheses are optional. Words following an asterisk are the 'arguments' that are passed to the command.

By default, RITA can:

* Quietly \*phrase.
  * Perform a command, but don't talk using TTS
* Again.
  * Perform the last requested command again
* Use \*spell.
* Cast \*spell.
* Shoot \*spell.
* Fire \*spell.
  * Use/cast/shoot/fire an item, using the selected token. (All four commands are the same at the moment, so "Rita, use Eldritch Blast" and "Rita, fire Eldritch Blast" will both cast Eldritch Blast)
* (What's the) range (of) (on) (my) \*spell.
  * Return the range of an item/spell
* (What's the) duration (of) (on) (my) \*spell.
  * Return the duration of an item/spell
* (What's the) level (of) (on) (my) \*spell.
  * Return the level of a spell
* (What's the) activation (of) (on) (my) \*spell.
  * Return information about the activation time on an item/spell
* (What's the) damage (of) (on) (my) \*spell.
  * Return the damage formula for an item/spell
* Summarise \*spell.
  * Return a summary of an item/spell, including range, damage, activation etc.
* Describe \*spell.
  * Return the description for an item/spell
* Play \*playlist.
  * Begin playing a playlist (Soon)
* Stop (the) music.
  * Stop all playlist music (Soon)
* Execute \*macro.
  * Execute a macro by name. Alternatively, if you ask Rita to do something she doesn't understand, she'll check to see if there's a matching macro (can be disabled in options).
* Target \*token.
  * Target a token by name (Soon)
* Kill \*token.
  * Set a token's HP to 0, and attempt to apply Dead condition (Soon)
* How many \*item (do I have).
  * Return quantity of an item (Soon)
* Spawn (a) (an) \*actor.
* Spon (a) (an) \*actor.
  * Spawn a token at the cursor position by actor name. Note the actor must be in your Actors directory, Compendia are not yet supported. (RITA sometimes picked me up as saying "spon", so I've added that in)
* Stop.
* Quiet.
* Shush.
  * Ask Rita to stop talking mid-speech
* Show (me) (all) (your) commands.
* List (all) (your) commands.
  * List out all available commands
* Other reactions
  * Rita will respond to some other stuff, like Hello, Thank You and some others.

## Executing macros

Say "Rita, execute macroName" to execute a macro

Alternatively, if you ask Rita to do something she doesn't understand, she'll check to see if there's a matching macro (can be disabled in options).

For example: "Rita, delete tokens". Rita will check if a command string matches "delete tokens". If it doesn't, she'll check your Macros directory to see if a macro exists called "delete tokens"(casing and spacing shouldn't matter) and execute it. Otherwise, she'll tell you what she thinks you said.

## Adding RITA support to my module

To add RITA support to your own module, simply listen to the `RITAReady` hook, then call `Rita.addCommands(moduleName, commandObject)`.

```javascript
Hooks.on('RITAReady', () => {
    Rita.addCommands('Your Module Name', {
        'your custom command string here': () => {
            // Code to run
        },
        'your second custom command string here': () => {
            // Code to run
        },
    })
});
```

For example, say we have a module that has some custom effects, and we want users to have the option of applying them using RITA. We might do the following:

```javascript
Hooks.on('RITAReady', () => {
    Rita.addCommands('SuperEffectsModule', {
        'apply effect *effect': (effect) => {
            // Whatever the user said after "apply effect" is passed into this fn as `effect`
            SuperEffectsModule.applyEffectByName(effect);
        },
        'remove effect *effect': (effect) => {
            SuperEffectsModule.removeEffectByName(effect);
        },
        'remove (all) effects' :() =>{
            // (all) is optional, so "Rita, remove effects" and "Rita, remove all effects" both work
            SuperEffectsModule.removeEffects();
        }
    })
});
```

Please try to be aware of conflicting with other commands, there is no real checking for that at the moment, so `apply effect *effect` and `apply *whatever` may conflict, as Rita isn't sure which command she should be running.

## Manifest

`https://raw.githubusercontent.com/BlitzKraig/fvtt-RITA/master/module.json`

## In the works

* Better matching
* More customisation options
* More base features

## Feedback

This module is open for feedback and suggestions! I would love to improve it and implement new features.

For bugs/feedback, create an issue on GitHub, or contact me on Discord at Blitz#6797

## [Release Notes](./CHANGELOG.md)
