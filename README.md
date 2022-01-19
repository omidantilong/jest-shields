# jest-shields

Generates coverage and test results reports from a jest run. These are then parsed and dumped into a gist, which you can pass to shields.io to generate your badges. Separate files are created in the gist for each badge. Refer to the shields.io documentation for implementation steps.

## Setup

- create a new personal access token on github 
- give the token gist permissions
- add the token as a secret in your repo, called GIST_SECRET
- create a new gist and grab the id
- add the id as a secret in your repo, called GIST_ID
- copy report.js into your scripts directory
- copy the report:generate and report:write scripts into your package.json

#### For existing workflows:

- open node.js.yml and copy the steps from lines 34-39 into your workflow

#### For new workflows:

- copy node.js.yml into your .github/workflows directory
