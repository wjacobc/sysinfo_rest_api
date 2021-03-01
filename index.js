const app = require("express")();
const execSync = require("child_process").execSync;
const fs = require("fs");

const PORT = 8080;
const STATUS_OK = 200;

app.listen(PORT, () => console.log("running!"));

// log the request time, ip, and command
function log_request(ip, cmd) {
    var log_file = fs.createWriteStream("request_log.txt",
        {flags: "a"});
    let today = new Date().toISOString();
    log_file.write(today + " " + ip + " " + cmd + "\n");
}

// check if new packages available
app.get("/check_updates", (req, res) => {
    const apt_output =
        execSync("apt list --upgradable 2>/dev/null| wc -l | tail -n 1",
        {encoding: "utf-8"});

    // don't count the line saying "Listing... Done"
    const num_updates = parseInt(apt_output) - 1;
    res.status(STATUS_OK).send(num_updates > 0);
    log_request(req.ip, "check_updates");
    });


// disk space endpoint
app.get("/disk_space", (req, res) => {

    const disk_space = execSync(
        "df -h | grep \"/dev/root\" | awk '{print $2}'",
        { encoding: "utf-8" }
        );

    res.status(STATUS_OK).send(disk_space);
    log_request(req.ip, "disk_space");
    });

app.get("/mem_percent", (req, res) => {

    const mem_output = execSync(
        "free | awk '/Mem/ {print $2 \" \" $3}'",
        { encoding: "utf-8" }
    );

    // the awk command prints the total memory and the used memory
    // with a space in between
    [total_mem, used_mem] = mem_output.split(" ");

    // calculate memory percentage - toFixed truncates to one decimal place
    mem_percent = (used_mem / total_mem * 100).toFixed(1) + "%";

    res.status(STATUS_OK).send(mem_percent);
    log_request(req.ip, "mem_percent");
    });

// get the cpu usage percentage
app.get("/cpu_percent", (req, res) => {

    const cpu_percent = execSync(
        "top -b -n 1 | tail -n +8 | awk '!/top$/ {sum += $9;} END{print sum \"%\"}'",
        { encoding: "utf-8" }
    );

    res.status(STATUS_OK).send(cpu_percent);
    log_request(req.ip, "cpu_percent");
    });

