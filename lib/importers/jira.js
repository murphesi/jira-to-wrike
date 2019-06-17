const csvtojson = require( 'csvtojson' );
const { parse } = require( 'json2csv' );
const json2xls = require('json2xls');

const fs = require( 'fs' );
var dateFormat = require('dateformat');


/**
 * NOTES
 * 1. Attachments are not included
 * 2. Comments are added into the description field in Wrike
 * 3. The JIRA issue number is prefixed to the Wrike task title
 * 4. Multiple JIRA projects will create separate Wrike folders
 * 
 * SETUP
 * 1. Update the mappings below
 */



// Source CSV from JIRA
const source = './inputs/jira.csv';

// User maps
const userMap = {
};

// Input > Output Mapping
const map = {
    'Key': 'Key',
    'Folder': 'Folder',
    'Summary': 'Title',
    'Priority': 'Priority',
    'Duration': 'Duration',
    'Created': 'Start Date',
    'Due date': 'End Date',
    'Depends On': 'Depends On',
    'Workflow': 'Workflow',
    'Assignee': 'Assigned To',
    'Issue key': 'Origin',
    'Project key': 'Prefix',
    'Project name': 'Project',
    'Issue Type': 'Type',
    'Custom field (Epic Name)': 'Epic',
    'Status': 'Status',
    'Custom status': 'Custom status',
    'Description': 'Description'
};

// Status maps ( Default is 'Active/Do' if not specified )
const statusMapActive = {
    'Backlog': 'Do',
    'In Progress': 'Doing',
    'Review': 'Review',
    'Ready For UAT': 'Ready for Client',
    'In UAT': 'Client Review',
    'Ready For Deployment': 'Approved'
};
const statusMapCompleted = {
    'Complete': 'Done',
    'Closed': 'Cancelled'
};






// Create list of fields
var destination = []; 
for ( let i = 0; i < Object.entries( map ).length; i++ ) {
    destination.push( ( Object.values( map ) )[i] );
}
var header = {}; 
for ( let i = 0; i < Object.entries( map ).length; i++ ) {
    header[Object.values( map )[i]] = '';
}

// Map and output data
csvtojson().fromFile( source )
    .then( ( data ) => {
        var rows = [];
        var folder = '/';
        for ( let j = 0; j < data.length; j++ ) {
            var row = data[j];

            var newData = {};
            for ( let i = 0; i < Object.entries( map ).length; i++ ) {
                if ( row[ Object.keys( map )[i] ] ) {
                    var value = row[ Object.keys( map )[i] ];
                    var key = Object.values( map )[i];

                    // Status mappings
                    if ( 'Status' == Object.keys( map )[i] ) {
                        for ( let k = 0; k < Object.entries( statusMapActive ).length; k++ ) {
                            if ( value == Object.keys( statusMapActive )[k] ) {
                                value = Object.values( statusMapActive )[k];

                                key = 'Custom status';
                                newData[ 'Status' ] = 'Active';
                            }
                        }
                        for ( let k = 0; k < Object.entries( statusMapCompleted ).length; k++ ) {
                            if ( value == Object.keys( statusMapCompleted )[k] ) {
                                value = Object.values( statusMapCompleted )[k];

                                key = 'Custom status';
                                newData[ 'Status' ] = 'Completed';
                            }
                        }

                        // Default status
                        if ( ! newData[ 'Status' ] ) {
                            newData[ 'Status' ] = 'Active';
                            key = 'Custom status';
                            value = 'Do';
                        }
                    }

                    // User mappings
                    if ( 'Assignee' == Object.keys( map )[i] ) {
                        for ( let k = 0; k < Object.entries( userMap ).length; k++ ) {
                            if ( value == Object.keys( userMap )[k] ) {
                                value = Object.values( userMap )[k];
                            }
                        }
                    }

                    newData[ `${key}` ] = value;
                }
            }

            // Add JIRA key in title
            newData['Title'] = `${newData['Origin']} - ${newData['Title']}`;
            
            // Look for comments
            for ( let x = 0; x < Object.entries( row ).length; x++ ) {
                if ( 'Comment' == Object.keys( row )[x].substr( 0, 7 ) ) {
                    let comment = Object.values( row )[x].split( ';' );

                    if ( comment.length > 0 && '' != comment[0] ) {
                        newData['Description'] += `\r\n\r\n~~JIRA COMMENT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`;

                        comment.forEach( line => {
                            newData['Description'] += `\r\n\t${line}`;
                        });
                    }
                }
            }
            
            var newFolder = `/${newData['Project']}/`;
            
            if ( folder != newFolder ) {
                var folderRow = Object.assign( {}, header );
                folderRow['Key'] = rows.length + 1;
                folderRow['Folder'] = '/';
                folderRow['Title'] = newFolder;
                folderRow['Status'] = 'Green';
                folderRow['Workflow'] = 'Default Workflow';
                
                folder = newFolder;
                rows.push( folderRow );
            }
            
            newData['Key'] = rows.length + 1;
            newData['Priority'] = 'Normal';
            newData['Duration'] = '1d';
            newData['Depends On'] = '';
            newData['Folder'] = newFolder;
            newData['Workflow'] = 'Default Workflow';

            if ( ! newData['Description'] ) {
                newData['Description'] = '';
            }

            newData['Start Date'] = dateFormat( newData['Start Date'], 'mm/dd/yy' );
            newData['End Date'] = dateFormat( newData['End Date'], 'mm/dd/yy' );

            rows.push( newData );
        }

        var csv = parse( rows, { fields: destination } );
        fs.writeFileSync( './outputs/output.csv', csv );

        var xls = json2xls( rows );
        fs.writeFileSync( './outputs/output.xls', xls, 'binary' );
    });
