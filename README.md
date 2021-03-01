# sysinfo_rest_api
A tool for me to practice REST API design with Node.JS and Express, as well as setting up a means for me to access information about my remote servers quickly.

Currently:

- Runs on Node.JS
- Logs requests with current time in ISO format, IP address of the requesting machine, and the endpoint accessed

Commands:

- Get available disk space at endpoint `/disk_space`
- Get cpu usage at endpoint `/cpu_percent`
- Get ram usage at endpoint `/ram_percent`
- Get whether updates are available at endpoint `/check_updates`

Note: the `check_updates` endpoint does not actually sync your remote repositories - every endpoint has no side effects, so no query will actually modify your system. For `check_updates` to be useful, some form of automated repository synchronization is required, such as a cronjob.
