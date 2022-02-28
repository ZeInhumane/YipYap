const requireDir = require( 'require-dir' );
const Discord = require( 'discord.js' );
const openDir = requireDir( './open' );
module.exports = {
    name: "open",
    description: "Open your chests or lootboxes with this command, quite possibly the second hardest command to code out.",
    syntax: "{box full name (with spaces)} {number}",
    aliases: [ 'chest', 'chests', 'pack', 'lootbox', 'lb' ],
    cooldown: 5,
    category: "Fun",
    async execute ( { message, args } ) {

            // Lowercase all args
            args.map( item => item.toLowerCase() );

            // Finds arguments no matter the position
            // Finds packAmt
            let packAmt = 1;
            const packAmtIndex = args.findIndex( arg => /^[1-9]\d*$/g.test( arg ) );
            if ( packAmtIndex != -1 ) {
                // Extracts packAmt
                packAmt = args[ packAmtIndex ];
                packAmt = parseInt( packAmt );
                if ( packAmt > 5 ) {
                    packAmt = 5;
                }
                // Removes packAmt from args list
                args.splice( packAmtIndex, 1 );
            }

            // Finds packType
            const packTypeIndex = args.findIndex( arg => /^[a-z]+$/ig.test( arg ) );
            if ( packTypeIndex == -1 ) {
                message.channel.send( 'Please specify a chest or pack that you would like to open' );
                return;
            }
            // Extracts packType
            let packType = args[ packTypeIndex ];
            // Removes packType from args list
            args.splice( packTypeIndex, 1 );
            // Uppercase first letter
            packType = packType.charAt( 0 ).toUpperCase() + packType.substring( 1 );

            let boxType = titleCase( args.join( " " ) );

            if ( !/^((treasure)? ?(chest)?|pack)$/ig.test( boxType ) ) {
                message.channel.send( `Unknown item. Please better specify item to open.` );
                return;
            }

            // Try to find similar item in db
            const item = await findPartialItem( `${ packType }${ boxType ? " " + boxType : "" }` );
            if ( !item ) {
                message.channel.send( `That item does not exist!` );
                return;
            }
            if ( item.length == 1 ) {
                boxType = item[ 0 ].itemName.split( ' ' );
                boxType.shift();
                boxType = boxType.join( ' ' );
                if ( boxType == "" || !/^((treasure)? ?(chest)?|pack)$/ig.test( boxType ) ) {
                    message.channel.send( `Specify chest or pack to open.` );
                    return;
                }
            } else {
                // maybe send message
                message.channel.send( `More than 1 item similar to ${ packType }${ boxType ? " " + boxType : "" }. Need to be more specific.` );
                return;
            }
            gachaName = packType + boxType
            gachas = openDir.findIndex( file => file == gachaName );
            if ( gachas == -1 ) {
                message.channel.send( `That item does not exist!` );
                return;
            }
            const gacha = openDir[ gachas ];
            const openGacha = require( `./open/${ gacha }` );
            const gachaFunc = openGacha.gacha;
        }
    };


