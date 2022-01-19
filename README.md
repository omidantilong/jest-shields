# jest-shields

- create a new personal access token on github 
- give the token gist permissions
- add the token as a secret in your repo, called GIST_SECRET
- create a new gist and grab the id
- add the id as a secret in your repo, called GIST_ID
- copy node.js.yml into your .github/workflows directory
- copy report.js into your scripts directory
- copy the report:generate and report:write scripts into your package.json
