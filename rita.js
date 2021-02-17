/**
 * R.I.T.A by Blitz
 * Your personal assistant
 */

// Rudimentary Interactive Tabletop Assistant
class Rita {

    static moduleName = "Rita"

    static assistantName = "Rita";
    static listening = false;
    static listeningTimeout;

    static macroExecuteKeyword = "Execute";

    static lastCommand = '';

    static async commonCommand() {
        //TODO: Remove this, and use a successful command event
        // if (Rita.listeningTimeout) {
        //     clearTimeout(Rita.listeningTimeout);
        //     Rita.listeningTimeout = undefined;
        // }

    }

    static async castSpell(spell, verb = 'Casting') {
        if (Rita.listening) {
            Rita.commonCommand();

            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(`Please select a token first`);
                return;
            }
            let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

            if (spellItem) {
                RitaTalkback.say(`${verb} ${spell}`);

                if (BetterRolls) {
                    // Need to call like this to prevent our speech recognition event from being passed through
                    BetterRolls.rollItem(spellItem).toMessage()
                } else {
                    spellItem.roll();
                }
                // alert(`${Rita.assistantName}: Casting ${spell}`);
            } else {
                RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
            }
        }
        Rita.listening = false;
    }

    static async executeMacro(macroName) {
        let macro = game.macros.find((macro) => {
            return macro.data.name.toLowerCase().split(' ').join('').replace(/&/g, 'and') == macroName.toLowerCase().split(' ').join('')
        });
        if (macro) {
            macro.execute()
            RitaTalkback.say(`<p>${macro.data.name}</p>`, {
                query: '<h2>Executing Macro</h2>'
            });
            return true;
        }
        return false;
    }
    
    static async spawn(actor) {
        if (Rita.listening) {
            Rita.commonCommand();
            let foundActor = await ActorDirectory.collection.find((actorToFind) => {
                return actorToFind.data.name.toLowerCase().split(' ').join() == actor.toLowerCase().split(' ').join()
            })
            if (foundActor) {

                const mouse = canvas.app.renderer.plugins.interaction.mouse;
                let mousePosition = mouse.getLocalPosition(canvas.app.stage);
                let gridPosition = canvas.grid.grid.getGridPositionFromPixels(mousePosition.x, mousePosition.y);
                let finalPos = canvas.grid.grid.getPixelsFromGridPosition(gridPosition[0], gridPosition[1]);

                const token = await Token.fromActor(foundActor, {x: finalPos[0], y: finalPos[1], hidden: false});
                const td = token.data;

    // Adjust token position
    const hg = canvas.dimensions.size / 2;
    td.x -= td.width * hg;
    td.y -= td.height * hg;
    if ( !event.shiftKey ) mergeObject(td, canvas.grid.getSnappedPosition(td.x, td.y));
    if ( !canvas.grid.hitArea.contains(td.x, td.y) ) return false;

    // Submit the Token creation request and activate the Tokens layer (if not already active)
    // this.activate();
    Token.create(td);
    
    RitaTalkback.say(`<h2>Spawning ${foundActor.name}</h2><img style="width: 20%;" src=${td.img}/>`);
                // const mouse = canvas.app.renderer.plugins.interaction.mouse;
                // let mousePosition = mouse.getLocalPosition(canvas.app.stage);
                // let gridPosition = canvas.grid.grid.getGridPositionFromPixels(mousePosition.x, mousePosition.y);
                // let finalPos = canvas.grid.grid.getPixelsFromGridPosition(gridPosition[0], gridPosition[1]);

                // let summon = await Token.fromActor(foundActor);

                // summon.x = finalPos[1];
                // summon.y = finalPos[0];
                // await game.scenes.viewed.createEmbeddedEntity("Token", summon);

            } else {
                RitaTalkback.say(`Can't find actor ${actor}`)
            }
        }
        Rita.listening = false;
    }

    /**
     * Pass a command object to register new commands
     * {'command word':callbackFN, 'second command word':callbackFN}
     * @param {Object} commandObject 
     */
    static async addCommands(scope, commandObject) {
        if (!scope) {
            return 'Please provide a scope'
        }
        ritaAnnyang.addCommands(commandObject, scope);
    }

    /**
     * Pass an array of strings, referencing commands to remove
     * ['command word', 'second command word']
     * @param {Array} commandArray 
     */
    static async removeCommands(commandArray) {
        if (!commandArray || commandArray.length < 1) {
            return 'Please provide a command array';
        }
        ritaAnnyang.removeCommands(commandArray);
    }

    static async initRita() {

        try {
            Rita.assistantName = game.settings.get("RITA", "assistantName");
        } catch (error) {
            Rita.assistantName = "Rita";
        }

        ritaAnnyang.removeCommands();

        const commands = {
            [`(Hello) (OK) (Okay) (Hi) ${Rita.assistantName}`]: () => {
                Rita.listening = true;
                this.listeningTimeout = setTimeout(() => {
                    Rita.listening = false;
                }, 5000)
            },
            [`(Hello) (OK) (Okay) (Hi) ${Rita.assistantName} *phrase`]: (phrase) => {
                Rita.listening = true;
                ritaAnnyang.trigger(phrase)
                if(phrase.toLowerCase() !== "again"){
                    Rita.lastCommand = phrase;
                }
            },
            'Quietly *phrase': (phrase) => {
                Rita.listening = true;
                RitaTalkback.skip = true;
                ritaAnnyang.trigger(phrase);
                Rita.lastCommand = phrase;
            },
            'Again': () => {
                if (Rita.listening) {
                    if(Rita.lastCommand){
                        Rita.commonCommand();
                        // RitaTalkback.skip = true;
                        console.log(Rita.lastCommand);
                        ritaAnnyang.trigger(Rita.lastCommand);
                    } else {
                        RitaTalkback.say("No previous command");
                        Rita.listening = false;
                    }
                }
            },
            'Use *spell': (spell) => Rita.castSpell(spell, 'Using'),
            'Cast *spell': (spell) => Rita.castSpell(spell, 'Casting'),
            'Shoot *spell': (spell) => Rita.castSpell(spell, 'Shooting'),
            'Fire *spell': (spell) => Rita.castSpell(spell, 'Firing'),
            '(What\'s the) range (of) (on) (my) *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        RitaTalkback.say(`${spellItem.labels.range || 'Range unknown'}`, {
                            query: RitaFormatter.getActorItem(spellItem, {headerSuffix : 'Range'})
                        });
                        // alert(`${Rita.assistantName}: Casting ${spell}`);
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            '(What\'s the) duration (of) (on) (my) *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        RitaTalkback.say(`${spellItem.labels.duration || 'Duration unknown'}`, {
                            query: RitaFormatter.getActorItem(spellItem, {headerSuffix : 'Duration'})
                        });
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            '(What\'s the) level (of) (on) (my) *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        RitaTalkback.say(`${spellItem.labels.level || 'Level unknown'}`, {
                            query: RitaFormatter.getActorItem(spellItem, {headerSuffix : 'Level'})
                        });
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            '(What\'s the) activation (of) (on) (my) *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        RitaTalkback.say(`${spellItem.labels.activation || 'Activation unknown'}`, {
                            query: RitaFormatter.getActorItem(spellItem, {headerSuffix : 'Activation'})
                        });
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            '(What\'s the) damage (of) (on) (my) *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        RitaTalkback.say(`${spellItem.labels.damage + ' ' + spellItem.labels.damageTypes || 'Damage unknown'}`, {
                            query: RitaFormatter.getActorItem(spellItem, {headerSuffix : 'Damage'})
                        });
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            'Summarise *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        let summary = ``;

                        if (spellItem.labels.activation) {
                            summary += `<p>Activation time: ${spellItem.labels.activation}.</p>`;
                        }
                        if (spellItem.labels.components) {
                            summary += `<p>Components: ${spellItem.labels.components}.</p>`
                        }
                        if (spellItem.labels.damage) {
                            summary += `<p>Damage: ${spellItem.labels.damage}`
                            if (spellItem.labels.damageTypes) {
                                summary += ` ${spellItem.labels.damageTypes}`
                            }
                            summary += `.</p>`

                        }
                        if (spellItem.labels.duration) {
                            summary += `<p>Duration: ${spellItem.labels.duration}.</p>`
                        }
                        if (spellItem.labels.level) {
                            summary += `<p>Level: ${spellItem.labels.level}.</p>`
                        }
                        if (spellItem.labels.materials) {
                            summary += `<p>Materials: ${spellItem.labels.materials}.</p>`
                        }
                        if (spellItem.labels.range) {
                            summary += `<p>Range: ${spellItem.labels.range}.</p>`
                        }
                        if (spellItem.labels.recharge && spellItem.labels.recharge != 'Recharge [undefined]') {
                            summary += `<p>Recharge: ${spellItem.labels.recharge}.</p>`
                        }
                        if (spellItem.labels.school) {
                            summary += `<p>School: ${spellItem.labels.school}.</p>`
                        }
                        if (spellItem.labels.target) {
                            summary += `<p>Target: ${spellItem.labels.target}.</p>`
                        }
                        if (spellItem.labels.toHit) {
                            summary += `<p>Bonus to hit: ${spellItem.labels.toHit}.</p>`
                        }
                        RitaTalkback.say(summary, {
                            query: RitaFormatter.getActorItem(spellItem, {headerPrefix : 'Summary of'})
                        });
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            'Describe *spell': async (spell) => {
                if (Rita.listening) {
                    Rita.commonCommand();

                    if (canvas.tokens.controlled.length < 1) {
                        RitaTalkback.say(`Please select a token with ${spell}`);
                        return;
                    }
                    let spellItem = await canvas.tokens.controlled[0].actor.items.find((item) => item.name.toLowerCase() == spell.toLowerCase())

                    if (spellItem) {
                        RitaTalkback.say(`<p>${spellItem.data.data.description.value}</p>`, {
                            query: RitaFormatter.getActorItem(spellItem)
                            
                            // `<button href="javascript:game.actors.get("${spellItem.actor.id}").getOwnedItem("${spellItem.id}").sheet.render(true)"><i class="fas fa-suitcase"></i>${spellItem.name}</button>`


                            // `<a class="entity-link" href="javascript:${spellItem.sheet.render(true)}"><i class="fas fa-suitcase"></i>${spellItem.name}</a>`
                            // canvas.tokens.controlled[0].actor.getOwnedItem(test._id).sheet.render(true)

                            // `<a class="entity-link" draggable="true" data-entity="Item" data-id="3J0uczR1weUPqVSm"><i class="fas fa-suitcase"></i> Shield</a>`
                        });
                    } else {
                        RitaTalkback.say(`${canvas.tokens.controlled[0].name} doesn't know ${spell}`);
                    }
                }
                Rita.listening = false;
            },
            'Play *playlist': (playlist) => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    RitaTalkback.say(`Playing ${playlist}`);
                    alert(`${Rita.assistantName}: Playing ${playlist}`);
                }
                Rita.listening = false;
            },
            'Stop (the) music': () => {

            },
            [`${Rita.macroExecuteKeyword} *macro`]: async (macro) => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    if (await Rita.executeMacro(macro)) {
                        return;
                    }
                    RitaTalkback.say(`Macro ${macro} not found`);
                }
                Rita.listening = false;
            },
            'Target *token': () => {},
            'Kill *token': () => {},
            'How many *item (do I have)': () => {},
            'Spawn (a) (an) *actor': Rita.spawn,
            'Spon (a) (an) *actor': Rita.spawn,
            'I love you': () => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    let response = [`Ok... That's nice ${game.user.name}`, 'Cool... Cool cool cool.', 'I like you too', 'I am incapable of love', `${Rita.assistantName} does not yet know the emotion: love`]
                    RitaTalkback.say(response[Math.floor(Math.random() * response.length)]);
                }
                Rita.listening = false;
            },
            'Hello': () => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    RitaTalkback.say(`Hi ${game.user.name}`);
                }
                Rita.listening = false;
            },
            'Stop': RitaTalkback.stop,
            'Quiet': RitaTalkback.stop,
            'Shush': RitaTalkback.stop,
            'Thank you': () => {

                if (Rita.listening) {
                    Rita.commonCommand();
                    let response = [`You're welcome ${game.user.name}`, 'Any time!', 'No worries', 'Happy to help']
                    RitaTalkback.say(response[Math.floor(Math.random() * response.length)]);
                }
                Rita.listening = false;
            },
            'Open the pod bay doors': () => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    RitaTalkback.say(`I'm sorry ${game.user.name}, I'm afraid I can't do that.`);
                }
                Rita.listening = false;
            },
            'Show (me) (all) commands': () => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    let commandScopes = [...new Set(ritaAnnyang.getCommandsList().map(command => command.scope))];

                    let commandsList = {};

                    for (let scope of commandScopes) {
                        commandsList[scope] = [];
                    }

                    for (let command of ritaAnnyang.getCommandsList()) {
                        commandsList[command.scope].push(command.originalPhrase);
                    }

                    let ritaMessage = '';
                    for (let key of Object.keys(commandsList)) {
                        ritaMessage += `<h2>${key}</h2>`;
                        for (let command of commandsList[key]) {
                            ritaMessage += `<p>${command}.</p>`
                        }
                    }

                    RitaTalkback.say(ritaMessage);
                }
                Rita.listening = false;
            },
            'List (all) commands': () => {
                if (Rita.listening) {
                    Rita.commonCommand();
                    let commandScopes = [...new Set(ritaAnnyang.getCommandsList().map(command => command.scope))];

                    let commandsList = {};

                    for (let scope of commandScopes) {
                        commandsList[scope] = [];
                    }

                    for (let command of ritaAnnyang.getCommandsList()) {
                        commandsList[command.scope].push(command.originalPhrase);
                    }

                    let ritaMessage = '';
                    for (let key of Object.keys(commandsList)) {
                        ritaMessage += `<h2>${key}</h2>`;
                        for (let command of commandsList[key]) {
                            ritaMessage += `<p>${command}.</p>`
                        }
                    }

                    RitaTalkback.say(ritaMessage);
                }
                Rita.listening = false;
            }

        };

        Rita.addCommands('RITA Base', commands);
        Hooks.callAll('RITAReady')

    }
    static async onInit() {

        Hooks.on('RITAReady', () => {
            Rita.addCommands('Custom RITA', {
                'show test alert': () => {
                    alert('Tested')
                }
            })
        });

        game.settings.register("RITA", "assistantName", {
            name: "Assistant Name",
            hint: "Changing the assistant name will change the trigger word",
            scope: "client",
            config: true,
            default: "Rita",
            type: String,
            onChange: value => {
                Rita.initRita()
            }
        });

        game.settings.register("RITA", "shouldPTT", {
            name: "Enable PTT",
            hint: "Hold down a key instead of saying your assistants name. NOTICE: Your game will refresh after updating this.",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: value => {
                document.location.reload();
            }
        });

        game.settings.register("RITA", "pttKey", {
            name: "PTT Key",
            hint: "Keycode referencing a key. NOTICE: Your game will refresh after updating this.",
            scope: "client",
            config: true,
            default: "Insert",
            type: String,
            onChange: value => {
                document.location.reload();
            }
        });

        game.settings.register('RITA', "shouldFindMacro", {
            name: "Enable automatic macro",
            hint: "If RITA does not understand a command, try to execute a macro by name",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        })

        game.settings.register("RITA", "shouldChat", {
            name: "Enable Chat output",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        });

        game.settings.register("RITA", "shouldSpeak", {
            name: "Enable TTS",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        });

        game.settings.register("RITA", "ttsRate", {
            name: "TTS Rate",
            scope: "client",
            config: true,
            type: Number,
            range: {
                min: 0.1,
                max: 2.0,
                step: 0.1
            },
            default: 1.0,
            onChange: value => {
                RitaTalkback.getVoice();
            }
        });

        game.settings.register("RITA", "ttsPitch", {
            name: "TTS Pitch",
            scope: "client",
            config: true,
            type: Number,
            range: {
                min: 0.1,
                max: 2.0,
                step: 0.1
            },
            default: 1.0,
            onChange: value => {
                RitaTalkback.getVoice();
            }
        });

        game.settings.register("RITA", "ttsVolume", {
            name: "TTS Volume",
            scope: "client",
            config: true,
            type: Number,
            range: {
                min: 0.1,
                max: 1.0,
                step: 0.05
            },
            default: 0.8,
            onChange: value => {
                RitaTalkback.getVoice();
            }
        });

        window.speechSynthesis.addEventListener('voiceschanged', function () {
            // console.log(window.speechSynthesis.getVoices());
            game.settings.register("RITA", "ttsVoice", {
                name: "TTS Voice",
                hint: "Select an available voice for Text-to-speech",
                scope: "client",
                config: true,
                choices: window.speechSynthesis.getVoices().map(voice => {
                    return voice.voiceURI
                }),
                default: window.speechSynthesis.getVoices()[0].voiceURI,
                type: String,
                onChange: value => {
                    RitaTalkback.getVoice();
                }
            });

            RitaTalkback.getVoice();
        })

        if (ritaAnnyang) {
            await Rita.initRita();
            // Start listening.
            ritaAnnyang.start();

            if (game.settings.get("RITA", "shouldPTT")) {

                let pttKey = game.settings.get("RITA", "pttKey") || 'r';

                window.addEventListener('keydown', function (e) {
                    e = e || window.event;
                    if (e.key == pttKey && !Rita.listening) {
                        Rita.listening = true;
                        AudioHelper.play({
                            src: 'modules/RITA/audio/active.ogg'
                        }, false)
                    }
                });
                window.addEventListener('keyup', function (e) {
                    e = e || window.event;
                    if (e.key == pttKey && Rita.listening) {
                        Rita.listening = false;
                        AudioHelper.play({
                            src: 'modules/RITA/audio/inactive.ogg'
                        }, false)
                    }
                });
            }

            ritaAnnyang.addCallback('resultMatch', function (userSaid, commandText, phrases) {
                console.log(userSaid); // sample output: 'hello'
                console.log(commandText); // sample output: 'hello (there)'
                console.log(phrases); // sample output: ['hello', 'halo', 'yellow', 'polo', 'hello kitty']
                if (commandText == `${Rita.assistantName} *phrase`) {
                    if (Rita.listeningTimeout) {
                        clearTimeout(Rita.listeningTimeout);
                        Rita.listeningTimeout = undefined;
                    }
                }

                // Need some way to:
                // Detect rita/listening
            });

            ritaAnnyang.addCallback('resultNoMatch', async function (phrases) {
                if (Rita.listening) {
                    try {
                        if (game.settings.get('RITA', 'shouldFindMacro')) {
                            // If macro exists with name, execute it

                            if (await Rita.executeMacro(phrases[0])) {
                                return;
                            }
                        }
                    } catch (e) {}
                    RitaTalkback.say(`I don't understand "${phrases[0]}"`)
                    console.log('no match')
                    console.log(phrases);
                }
                Rita.listening = false;
            });


            $(document).on('click', '.rita-actoritem', function(){
                let ritaData = $(this).data("rita").split(':');
                game.actors.get(ritaData[0]).getOwnedItem(ritaData[1]).sheet.render(true)
                return false;
           });

            ui.notifications.notify(`R.I.T.A: ${Rita.assistantName} is listening`);
        }



    }
}

Hooks.once("canvasReady", Rita.onInit);