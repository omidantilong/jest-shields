/* istanbul ignore file */
const core = require("@actions/core")
const http = require("https")
const fs = require("fs")

// TODO
// Rather than relying on jest to throw the error to make the build fail,
// it could be handled in here manually instead with core.setFailed
// As this script is the last thing that runs in the pipeline,
// we could still write the reports to the gist files and then throw.
// ! Current implementation means the count of passed tests will always be 100%

const valueToColor = (value) => {
  const n = Math.floor(value / 10) * 10
  const map = {
    0: "red",
    10: "red",
    20: "orange",
    30: "orange",
    40: "orange",
    50: "yellow",
    60: "yellow",
    70: "yellow",
    80: "green",
    90: "green",
    100: "#2FC050",
  }
  return map[n]
}

const createBadge = (name, message, value) => {
  return {
    content: JSON.stringify({
      schemaVersion: 1,
      label: name,
      message: message,
      color: valueToColor(value),
    }),
  }
}

try {
  const coverageFile = fs.readFileSync("coverage/coverage-summary.json", "utf8")
  const reportFile = fs.readFileSync("coverage/report.json", "utf8")

  const coverage = JSON.parse(coverageFile)
  const report = JSON.parse(reportFile)

  delete report.openHandles
  delete report.snapshot
  delete report.startTime
  delete report.testResults
  delete report.wasInterrupted
  delete report.coverageMap

  const content = JSON.stringify({ coverage: coverage.total, report })
  //process.stdout.write(content)
  const { lines, statements, functions, branches } = coverage.total
  const request = JSON.stringify({
    files: {
      "report.json": { content: content },
      "coverage-lines.json": createBadge("Lines", lines.pct.toString() + "%", lines.pct),
      "coverage-statements.json": createBadge(
        "Statements",
        statements.pct.toString() + "%",
        statements.pct
      ),
      "coverage-functions.json": createBadge(
        "Functions",
        functions.pct.toString() + "%",
        functions.pct
      ),
      "coverage-branches.json": createBadge(
        "Branches",
        branches.pct.toString() + "%",
        branches.pct
      ),
      "tests-passed.json": createBadge(
        "Passed",
        report.numPassedTests + "/" + report.numTotalTests,
        (report.numPassedTests / report.numTotalTests) * 100
      ),
    },
  })

  // Perform the actual request. The user agent is required as defined in
  // https://developer.github.com/v3/#user-agent-required
  const req = http.request(
    {
      host: "api.github.com",
      path: "/gists/" + process.env.GISTID,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": request.length,
        "User-Agent": "CoverageReporter",
        Authorization: "token " + process.env.SECRET,
      },
    },
    (res) => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        core.setFailed("Failed to write report: " + res.statusCode + " " + res.statusMessage)
      } else {
        process.stdout.write("Success")
      }
      //let body = '';
      //res.on('data', data => body += data);
      //res.on('end', () => console.log('result:' + body));
    }
  )

  req.write(request)
  req.end()
} catch (err) {
  console.error(err)
  core.setFailed(err)
}
