/**
 * RITA by Blitz
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

    // Access child properties by period split string - Should move this somewhere better
    static getNestedByString = function(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

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

    /**
     * Pass a command object to register new commands
     * Use addCommandsWithTranslations for i18n support
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


    /**
     * Pass a class/object with command functions,
     * and a period-separated string pointing to your translation class command object
     * to register new commands with full i18n support
     * @param {string} scope - Your module name
     * @param {object} commandRunner - Should point to a class with static functions, or an object containing your functions
     * @param {string} translationsPath - The string path leading to your command object in internationalization files.
     */
    static async addCommandsWithTranslations(scope, commandRunner, translationsPath = "RITA.commands"){
        if (!scope) {
            return 'Please provide a scope'
        }
        
        var commands = {}
        let translationsObject = Rita.getNestedByString(game.i18n.translations, translationsPath);
         // Get array of command keys, matching fn names in RitaCommands
         for (let commandKey of Object.keys(translationsObject)){
            // console.log(commandKey);
            
            // Check if a 'phrase' is just a string, and put it inside an array to make parsing easier below
            if(typeof translationsObject[commandKey] == 'string'){
                translationsObject[commandKey] = [translationsObject[commandKey]]
            }
            // Get array of phrases
            for (let phrase of translationsObject[commandKey]){
                let variables = {};
                if(typeof phrase == "object"){
                    // We have extra variables to handle here...
                    variables = phrase[Object.keys(phrase)[0]];
                    phrase = Object.keys(phrase)[0];
                }
                // Insert 'global' variables if they exist, add more to the rh object if needed
                phrase = game.i18n.format(phrase, {assistantName: Rita.assistantName, macroExecuteKeyword: Rita.macroExecuteKeyword});

                // TODO find a better way to do this:
                // Pass the original parameters, and any variables we parsed out of the translations
                commands[phrase] = (parameters)=>{commandRunner[commandKey].apply(this, [parameters, variables])};
            }
        }
        
        Rita.addCommands(scope, commands);
        return;
    }

    static async initRita() {

        try {
            Rita.assistantName = game.settings.get("RITA", "assistantName");
        } catch (error) {
            Rita.assistantName = "Rita";
        }

        ritaAnnyang.setLanguage(game.i18n.lang)

        ritaAnnyang.removeCommands();

        await Rita.addCommandsWithTranslations('RITA Base', RitaCommands, "RITA.commands");

        Hooks.callAll('RITAReady');
    }
    static async onInit() {

        game.settings.register("RITA", "assistantName", {
            name: "RITA.settings.assistantName.name",
            hint: "RITA.settings.assistantName.hint",
            scope: "client",
            config: true,
            default: "Rita",
            type: String,
            onChange: value => {
                Rita.initRita()
            }
        });

        game.settings.register("RITA", "shouldPTT", {
            name: "RITA.settings.shouldPTT.name",
            hint: "RITA.settings.shouldPTT.hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
            onChange: value => {
                document.location.reload();
            }
        });

        game.settings.register("RITA", "pttKey", {
            name: "RITA.settings.pttKey.name",
            hint: "RITA.settings.pttKey.hint",
            scope: "client",
            config: true,
            default: "Insert",
            type: String,
            onChange: value => {
                document.location.reload();
            }
        });

        game.settings.register('RITA', "shouldFindMacro", {
            name: "RITA.settings.shouldFindMacro.name",
            hint: "RITA.settings.shouldFindMacro.hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        })

        game.settings.register("RITA", "shouldChat", {
            name: "RITA.settings.shouldChat.name",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        });

        game.settings.register("RITA", "shouldSpeak", {
            name: "RITA.settings.shouldSpeak.name",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        });

        game.settings.register("RITA", "respondToChat", {
            name: "RITA.settings.respondToChat.name",
            hint: "RITA.settings.respondToChat.hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        })

        game.settings.register("RITA", "ttsRate", {
            name: "RITA.settings.ttsRate.name",
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
            name: "RITA.settings.ttsPitch.name",
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
            name: "RITA.settings.ttsVolume.name",
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
                name: "RITA.settings.ttsVoice.name",
                hint: "RITA.settings.ttsVoice.hint",
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
                if(commandText.toLowerCase().indexOf(Rita.assistantName.toLowerCase()) != 0){
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
                    RitaTalkback.say(game.i18n.format("RITA.responses.notUnderstood", {phrase:phrases[0]}));
                    console.log('no match')
                    console.log(phrases);
                }
                Rita.listening = false;
            });


            $(document).on('click', '.rita-actoritem', function () {
                let ritaData = $(this).data("rita").split(':');
                game.actors.get(ritaData[0]).getOwnedItem(ritaData[1]).sheet.render(true)
                return false;
            });

            ui.notifications.notify(`RITA: ${game.i18n.format("RITA.notif.listening", {assistantName: Rita.assistantName})}`);
        }



    }

    static onChatMessage(app, content, data){
        if(game.settings.get("RITA", "respondToChat")){
            if(content.toLowerCase().indexOf(Rita.assistantName.toLowerCase()) == 0){
                // Rita was typed first
                ritaAnnyang.trigger(Rita.fuzzString(content));
                return false;
            } else if (Rita.fuzzString(content) == "rita initiate testing protocol 101") {
                Rita._runTests();
            }
        }
    }
}

Hooks.once("canvasReady", Rita.onInit);
Hooks.on("chatMessage", Rita.onChatMessage);