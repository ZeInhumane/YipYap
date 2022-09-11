exports.regex = {
    // gets any integer number
    anyInt: new RegExp(/^[1-9]\d*$/, 'g'),
    anyMention: new RegExp(/<@\d*>/, 'g'),
};