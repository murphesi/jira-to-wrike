# Wrike XLS Import Generator
A set of tools to generate a Wrike formatted XLS from different sources. eg. JIRA > Wrike, Trello > Wrike

Note: This is a very quick and dirty script. Feel free to contribute!

## Usage
1. Export a list of issues from JIRA as CSV ( Trello as JSON )
2. Place export into `./inputs/jira.csv` or `./inputs/trello.json`
3. Run import generator `node cloud jira` or `node cloud trello`
4. The generated Wrike XLS will be in `./outputs/output.xls`
5. Import the generated XLS into a folder in Wrike.

## Mappings
Update importer mappings ( see Importer sections below )

## Notes
Trello is a work in progress. Required fields have been identified but the script has not been finished.

## Importers

### JIRA Importer Notes
1. Attachments are not included
2. Comments are added into the description field in Wrike
3. The JIRA issue number is prefixed to the Wrike task title
4. Multiple JIRA projects will create separate Wrike folders
5. You will need to modify the `map` objects in `./importers/jira.js` to properly generate the correct status and user outputs.