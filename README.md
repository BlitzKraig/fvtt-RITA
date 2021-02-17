# RITA for FVTT

![RITA Release](https://github.com/BlitzKraig/fvtt-RITA/workflows/RITA%20Release/badge.svg)
![Latest Release Download Count](https://img.shields.io/github/downloads/BlitzKraig/fvtt-RITA/latest/rita-release.zip)

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Q5Q01YIEJ)

## What is it?

RITA is a voice-activated assistant for FVTT.

Full documentation coming soon, but in the meantime:

Try saying "Rita, list commands"

Parentheses mean the word is optional. Asterisks mean any words after this point will be sent to the callback function.

Say "Rita, Stop" if you need the assistant to stop talking

Say "Rita, execute macroName" to execute a macro

Alternatively, if you ask Rita to do something she doesn't understand, she'll check to see if there's a matching macro (can be disabled in options)

Check module settings for PTT, TTS options and other goodies.

To add RITA support to your own module, add RITA as a dependency, then use:

```javascript
Hooks.on('RITAReady', () => {
    Rita.addCommands('Your Module Name', {
        'your custom command string here': () => {
            // Code to run
        }
    })
});
```

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
