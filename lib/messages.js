const fs = require("fs");

//lol
const getSoundListMarkdown = () => {
    const files = fs.readdirSync("sounds");
    const hammer = [];
    let line = 0;
    let maxlines = 25;
    for (let file of files) {
        if (!hammer[line]) { hammer[line] = [] }
        hammer[line].push(` ${file.replace(".opus", "")}`.padEnd(17, ' '))
        if (line < maxlines - 1) {
            line++;
        }
        else {
            line = 0;
        }
    }
    let file_string = "";
    for (line of hammer) {
        line[line.length - 1] = " " + line[line.length - 1].trim()
        file_string += line.join("|") + "\r\n";
    }
    return ("```" + "Sound list: \r\n" + file_string + "```");

}

const makeHelpMarkdown = (commands) => {
    return (
        "```" +
        "Command list: \r\n" +
        Object.keys(commands)
            .map((key) => {
                return `.${key}: ${commands[key].desc}`;
            })
            .join("\r\n") +
        "```"
    );
}

module.exports = { getSoundListMarkdown, makeHelpMarkdown }