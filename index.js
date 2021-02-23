const app = require("express")();
const execSync = require("child_process").execSync;
const fs = require("fs");

const port = 8080;

app.listen(port, () => console.log("running!"));

// log the request time, ip, and command
function log_request(ip, cmd) {
    var log_file = fs.createWriteStream("request_log.txt",
        {flags: "a"});
    let today = new Date().toISOString();
    log_file.write(today + " " + ip + " " + cmd + "\n");
}

// disk space endpoint
app.get("/disk_space", (req, res) => {

    const disk_space = execSync(
        "df -h | grep \"/dev/root\" | awk '{print $2}'",
        { encoding: "utf-8" }
        );

    res.status(200).send(disk_space);
    log_request(req.ip, "disk_space");
    });


