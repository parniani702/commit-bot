const simpaleGit = require("simple-git")
const fs = require("fs")
const path = require("path")
const schedule = require("node-schedule")

const repoPath = path.join(__dirname, "git-repo")
const fileName = "random-file.txt"
const filePath = path.join(repoPath, fileName)
const botBranch = "main"


const message = [
    "انجام شدن کامیت",
    "🥷"
]

// create random content - 🥷
function generateRandomtext () {
    const now = new Date().toISOString();
    return `Update at: ${now} | 🥷`
}

// choose rand Commit message
function createRandCommit() {
    return commitMessages[Math.floor(Math.random() * 1000)]
}

// if not exist
function ensureFileExists() {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "Initial content");
    }
}

function renameMasterToMain(git) {
    return git.branchLocal().then(({current}) => {
        if (current === "master") {
            return git.checkoutLocalBranch("main").then(() => {
                git.deleteLocalBranch("master", true)
            })
        }
    })
}

// Commit And Push

function commitFile() {
    ensureFileExists();

    const newContent = generateRandomtext();
    const oldContent = fs.readFileSync(filePath , "utf-8")

    if(oldContent === newContent) {
        console.log("# No Change ")
        return
    }

    fs.writeFileSync(filePath , newContent);

    const git = simpleGit(repoPath)

    renameMasterToMain(git)
    .then(() => git.add(fileName))
    .then(() => git.commit(generateRandomtext()))
    .then(() => git.push("origin", botBranch))
    .then(() => {
        console.log(`Change commit & push at ${new Date().toLocaleDateString()}`)
    })
    .catch((err) => {
        console.error("Error 🥷", err)
    })
}

commitFile();

schedule.scheduleJob("0 * * * *", commitFile)