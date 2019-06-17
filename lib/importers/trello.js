/**
 * JSON - https://trello.com/b/{board id}.json
 * 
 * name - Board Name
 * url - board url
 * cards
 *  id
 *  closed
 *  idBoard
 *  idList
 *  name
 *  desc
 *  shortLink
 *  badges
 *      comments  - check if > 0 then need to call comment api /card/:id/actions
 *  dueComplete
 *  due
 *  idChecklists
 *  idMembers
 *  url
 *  attachments
 *      name
 *      url
 *      idMember
 *  customFieldItems
 * 
 * actions  ( comments are in here )
 *  type = commentCard
 *  data
 *      card
 *          id = card id
 *      text - comment
 * 
 * lists
 *  id
 *  idBoard
 *  name
 * 
 * members
 *  id
 *  fullName
 *  username
 *  
 * checklists
 *  idCard
 *  checkItems
 *      state
 *      name
 */

const fs = require( 'fs' );
var dateFormat = require('dateformat');

let data = JSON.parse( fs.readFileSync( './inputs/trello.json' ) );

console.log(data);

// Convert input JSON to Wrike format ( use the Jira code )