const args = require( 'yargs' ).argv;

if ( ! args._[0] ) { 
    console.log( 'Specify an import option: [jira|trello]. eg. `node import jira`' );

    return;
}

if ( 'jira' == args._[0] ) {
    console.log( 'Creating Wrike import from JIRA...' );
    
    require( './lib/importers/jira' );
} else if ( 'trello' == args._[0] ) {
    console.log( 'Creating Wrike import from Trello...' );
    
    require( './lib/importers/trello' );
}

console.log( 'Complete. Check the ./outputs folder for your Wrike import' );
