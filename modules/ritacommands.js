class RitaCommands {
    static listen() {
        Rita.listening = true;
        AudioHelper.play({
            src: 'modules/RITA/audio/active.ogg'
        }, false)
        Rita.listeningTimeout = setTimeout(() => {
            Rita.listening = false;
            AudioHelper.play({
                src: 'modules/RITA/audio/inactive.ogg'
            }, false)
            clearTimeout(Rita.listeningTimeout);
            Rita.listeningTimeout = undefined;
        }, 5000)
    }

    static runCommand(phrase) {
        Rita.listening = true;
        ritaAnnyang.trigger(phrase)
        if (phrase.toLowerCase() !== "again") {
            Rita.lastCommand = phrase;
        }
    }

    static quietly(phrase) {
        Rita.listening = true;
        RitaTalkback.skip = true;
        ritaAnnyang.trigger(phrase);
        if (phrase.toLowerCase() !== "again") {
            Rita.lastCommand = phrase;
        }
    }

    static again() {
        if (Rita.listening) {
            if (Rita.lastCommand) {
                console.log(Rita.lastCommand);
                ritaAnnyang.trigger(Rita.lastCommand);
            } else {
                RitaTalkback.say(game.i18n.localize("RITA.responses.noPreviousCommand"));
                Rita.listening = false;
            }
        }
    }

    static async useSpellItem(spell, {
        verb = 'Casting'
    } = {}) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.localize("RITA.responses.selectToken"));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(game.i18n.format("RITA.responses.doActionOnSpellItem", {verb: verb, spell: spell}));

                if (BetterRolls) {
                    // Need to call like this to prevent our speech recognition event from being passed through
                    BetterRolls.rollItem(spellItem).toMessage()
                } else {
                    spellItem.roll();
                }
                // alert(`${Rita.assistantName}: Casting ${spell}`);
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async getRangeSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.range || game.i18n.localize("RITA.responses.rangeUnknown")}`, {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.range")
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async getDurationSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.duration || game.i18n.localize("RITA.responses.durationUnknown")}`, {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.duration")
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async getLevelSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.level || game.i18n.localize("RITA.responses.levelUnknown")}`, {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.level")
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async getActivationSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.activation || game.i18n.localize("RITA.responses.activationUnknown")}`, {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.activation")
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async getDamageSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(`${spellItem.labels.damage + ' ' + spellItem.labels.damageTypes || game.i18n.localize("RITA.responses.damageUnknown")}`, {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.damage")
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }


    static async getSpellItemCount(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            // TODO: Dirty af, and bad for localization. Look into pluralizing and de-pluralizing nicely
            if(!spellItem){
                // Remove any s's at the end of the words
                spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell.replace(/s\b/g, ''));
            }
            if(!spellItem){
                // Add s to the end of the string
                spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell += 's');
            }

            if (spellItem) {
                RitaTalkback.say(game.i18n.format("RITA.responses.quantity", {quantity: spellItem.data.data?.quantity || 1, spell: spellItem.name}), {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.quantity")
                })
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async summariseSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }

            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                let summary = ``;

                if (spellItem.labels.activation) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.activationTime")} ${spellItem.labels.activation}.</p>`;
                }
                if (spellItem.labels.components) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.components")} ${spellItem.labels.components}.</p>`
                }
                if (spellItem.labels.damage) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.damage")} ${spellItem.labels.damage}`
                    if (spellItem.labels.damageTypes) {
                        summary += ` ${spellItem.labels.damageTypes}`
                    }
                    summary += `.</p>`

                }
                if (spellItem.labels.duration) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.duration")} ${spellItem.labels.duration}.</p>`
                }
                if (spellItem.labels.level) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.level")} ${spellItem.labels.level}.</p>`
                }
                if (spellItem.labels.materials) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.materials")} ${spellItem.labels.materials}.</p>`
                }
                if (spellItem.labels.range) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.range")} ${spellItem.labels.range}.</p>`
                }
                if (spellItem.labels.recharge && spellItem.labels.recharge != 'Recharge [undefined]') {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.recharge")} ${spellItem.labels.recharge}.</p>`
                }
                if (spellItem.labels.school) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.school")} ${spellItem.labels.school}.</p>`
                }
                if (spellItem.labels.target) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.target")} ${spellItem.labels.target}.</p>`
                }
                if (spellItem.labels.toHit) {
                    summary += `<p>${game.i18n.localize("RITA.responses.summary.toHit")} ${spellItem.labels.toHit}.</p>`
                }
                RitaTalkback.say(summary, {
                    query: RitaFormatter.getActorItem(spellItem, "RITA.responses.actorItemHeader.summary")
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async describeSpellItem(spell) {
        if (Rita.listening) {
            if (canvas.tokens.controlled.length < 1) {
                RitaTalkback.say(game.i18n.format("RITA.responses.selectTokenWithSpell", {spell:spell}));
                return;
            }
            let spellItem = await Rita.getSpellItemFromActor(canvas.tokens.controlled[0].actor, spell);

            if (spellItem) {
                RitaTalkback.say(`<p>${spellItem.data.data.description.value}</p>`, {
                    query: RitaFormatter.getActorItem(spellItem)
                });
            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static playPlaylist(playlist) {
        if (Rita.listening) {
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"))
        }
        Rita.listening = false;
    }

    static async stopAllPlaylists() {
        if (Rita.listening) {
            RitaTalkback.say(game.i18n.localize("RITA.responses.stoppingMusic"))
            for (let playlist of game.playlists.playing) {
                await game.playlists.get(playlist.id).stopAll();
            }
        }
        Rita.listening = false;
    }

    static async executeMacro(macro) {
        if (Rita.listening) {
            if (await Rita.executeMacro(macro)) {
                return;
            }
            RitaTalkback.say(game.i18n.format("RITA.responses.macroNotFound", {macro: macro}));
        }
        Rita.listening = false;
    }

    static targetToken(token) {
        if (Rita.listening) {
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"));
        }
        Rita.listening = false;
    }

    static killToken(token) {
        if (Rita.listening) {
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"));
        }
        Rita.listening = false;
    }

    static rollDice(rollFormula){
        if (Rita.listening) {
            // Thankfully, numbers appear to be parsed as integers, which is handy for i18n

            // rollFormula = Rita.fuzzString(rollFormula);

            // Replace any dashes with a space
            rollFormula = rollFormula.replace(/-/g, ' ');
            
            // Use the regexp from translations to convert n sided die to dn
            for (let sidedDie of game.i18n.translations.RITA.rollDiceExtras.sidedDie){
                rollFormula = rollFormula.replace(new RegExp(sidedDie ,'g'), 'd$1');
            }

            // Replace 'and' and 'plus' with +
            for (let plusString of game.i18n.translations.RITA.rollDiceExtras.plus){
                rollFormula = rollFormula.replace(new RegExp(`${plusString}` ,'g'), '+');
            }

            // Replace 'an' and 'a' with 1
            for (let singularString of game.i18n.translations.RITA.rollDiceExtras.singular){
                rollFormula = rollFormula.replace(new RegExp(`^${singularString} ` ,'g'), '1').replace(new RegExp(` ${singularString} `, 'g'), ' 1');
            }
            // Strip spaces
            rollFormula = rollFormula.replace(/ /g, '');

            try{
            let roll = new Roll(rollFormula).roll();
            roll.toMessage({
                speaker: {alias: Rita.assistantName},
            });

            RitaTalkback.say(`<p>${game.i18n.format("RITA.rollDiceExtras.rolledFormula", {rollFormula: "[[/roll ${roll._formula}]]"})}</p> <p>${game.i18n.format("RITA.rollDiceExtras.formulaResult", {result: `<b>${roll.total}</b>`})}</p>`,
            {query: `<h2>${game.i18n.localize("RITA.rollDiceExtras.rolledDiceHeader")}</h2>`});
        } catch(e){
            RitaTalkback.say(game.i18n.format("RITA.rollDiceExtras.rollFail", {rollFormula: rollFormula}));
        }
            // PARSE:
            // a to 1
            // and to plus
            // plus to +
            // parse skill + ability names etc.?
        }
        Rita.listening = false;
    }

    static async spawnToken(actor) {
        if (Rita.listening) {
            let foundActor = await ActorDirectory.collection.find((actorToFind) => {
                return actorToFind.data.name.toLowerCase().split(' ').join('') == actor.toLowerCase().split(' ').join('')
            })
            if (foundActor) {

                const mouse = canvas.app.renderer.plugins.interaction.mouse;
                let mousePosition = mouse.getLocalPosition(canvas.app.stage);
                let gridPosition = canvas.grid.grid.getGridPositionFromPixels(mousePosition.x, mousePosition.y);
                let finalPos = canvas.grid.grid.getPixelsFromGridPosition(gridPosition[0], gridPosition[1]);

                const token = await Token.fromActor(foundActor, {
                    x: finalPos[0],
                    y: finalPos[1],
                    hidden: false
                });
                const td = token.data;

                // Adjust token position
                const hg = canvas.dimensions.size / 2;
                td.x -= td.width * hg;
                td.y -= td.height * hg;
                if (!event.shiftKey) mergeObject(td, canvas.grid.getSnappedPosition(td.x, td.y));
                if (!canvas.grid.hitArea.contains(td.x, td.y)) return false;

                // Submit the Token creation request and activate the Tokens layer (if not already active)
                // this.activate();
                Token.create(td);

                RitaTalkback.say(`<h2>${game.i18n.format("RITA.responses.spawningToken", {tokenName: foundActor.name})}</h2><img style="width: 20%;" src=${td.img}/>`);

            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.actorNotFound", {actor: actor}))
            }
        }
        Rita.listening = false;
    }

    static listAllCommands() {
        if (Rita.listening) {
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

    static silenceRita() {
        if (Rita.listening) {
            RitaTalkback.stop();
        }
        Rita.listening = false;
    }

    static sayLoveYou() {
        if (Rita.listening) {
            // TODO: Pull this functionality out and make it available to all responses (multiple possible responses)
            let response = game.i18n.translations["RITA"]["responses"]["loveYouEasterEgg"];
            RitaTalkback.say(game.i18n.format(response[Math.floor(Math.random() * response.length)], {user: game.user.name, assistantName: Rita.assistantName}));
        }
        Rita.listening = false;
    }

    static sayHello() {
        if (Rita.listening) {
            RitaTalkback.say(game.i18n.format("RITA.responses.sayHello", {user: game.user.name}));
        }
        Rita.listening = false;
    }

    static sayThankYou() {
        if (Rita.listening) {
            let response = game.i18n.translations["RITA"]["responses"]["sayThankYou"];
            RitaTalkback.say(game.i18n.format(response[Math.floor(Math.random() * response.length)], {user: game.user.name}));
        }
        Rita.listening = false;
    }

    static sayPodBayDoors() {
        if (Rita.listening) {
            RitaTalkback.say(game.i18n.format("RITA.responses.podBayEasterEgg", {user: game.user.name}));
        }
        Rita.listening = false;
    }
}