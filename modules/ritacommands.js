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
                Rita.commonCommand();
                // RitaTalkback.skip = true;
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
            Rita.commonCommand();

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
                RitaTalkback.say(game.i18n.format("RITA.responses.tokenSpellItemUnknown", {token:canvas.tokens.controlled[0].name, spell:spell}));
            }
        }
        Rita.listening = false;
    }

    static async getRangeSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

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
            Rita.commonCommand();

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
            Rita.commonCommand();

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
            Rita.commonCommand();

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
            Rita.commonCommand();

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
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"));
        }
        Rita.listening = false;
    }

    static async summariseSpellItem(spell) {
        if (Rita.listening) {
            Rita.commonCommand();

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
            Rita.commonCommand();

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
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"))
        }
        Rita.listening = false;
    }

    static stopAllPlaylists() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"))
        }
        Rita.listening = false;
    }

    static async executeMacro(macro) {
        if (Rita.listening) {
            Rita.commonCommand();
            if (await Rita.executeMacro(macro)) {
                return;
            }
            RitaTalkback.say(game.i18n.format("RITA.responses.macroNotFound", {macro: macro}));
        }
        Rita.listening = false;
    }

    static targetToken(token) {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"));
        }
        Rita.listening = false;
    }

    static killToken(token) {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.localize("RITA.responses.comingSoon"));
        }
        Rita.listening = false;
    }

    static async spawnToken(actor) {
        if (Rita.listening) {
            Rita.commonCommand();
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
                // const mouse = canvas.app.renderer.plugins.interaction.mouse;
                // let mousePosition = mouse.getLocalPosition(canvas.app.stage);
                // let gridPosition = canvas.grid.grid.getGridPositionFromPixels(mousePosition.x, mousePosition.y);
                // let finalPos = canvas.grid.grid.getPixelsFromGridPosition(gridPosition[0], gridPosition[1]);

                // let summon = await Token.fromActor(foundActor);

                // summon.x = finalPos[1];
                // summon.y = finalPos[0];
                // await game.scenes.viewed.createEmbeddedEntity("Token", summon);

            } else {
                RitaTalkback.say(game.i18n.format("RITA.responses.actorNotFound", {actor: actor}))
            }
        }
        Rita.listening = false;
    }

    static listAllCommands() {
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

    static silenceRita() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.stop();
        }
        Rita.listening = false;
    }

    static sayLoveYou() {
        if (Rita.listening) {
            Rita.commonCommand();
            // TODO: Pull this functionality out and make it available to all responses (multiple possible responses)
            let response = game.i18n.translations["RITA"]["responses"]["loveYouEasterEgg"];
            RitaTalkback.say(game.i18n.format(response[Math.floor(Math.random() * response.length)], {user: game.user.name, assistantName: Rita.assistantName}));
        }
        Rita.listening = false;
    }

    static sayHello() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.format("RITA.responses.sayHello", {user: game.user.name}));
        }
        Rita.listening = false;
    }

    static sayThankYou() {
        if (Rita.listening) {
            Rita.commonCommand();
            let response = game.i18n.translations["RITA"]["responses"]["sayThankYou"];
            RitaTalkback.say(game.i18n.format(response[Math.floor(Math.random() * response.length)], {user: game.user.name}));
        }
        Rita.listening = false;
    }

    static sayPodBayDoors() {
        if (Rita.listening) {
            Rita.commonCommand();
            RitaTalkback.say(game.i18n.format("RITA.responses.podBayEasterEgg", {user: game.user.name}));
        }
        Rita.listening = false;
    }
}