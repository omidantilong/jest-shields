# jest-shields

- create a new personal access token on github 
- give the token gist permissions
- add the token as a secret in your repo, called GIST_SECRET
- create a new gist and grab the id
- add the id as a secret in your repo, called GIST_ID
- copy report.js into your scripts directory
- copy the report:generate and report:write scripts into your package.json

### For existing workflows:

- open node.js.yml and copy the steps from lines 34-39 into your workflow

### For new workflows:

- copy node.js.yml into your .github/workflows directory
