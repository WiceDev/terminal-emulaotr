import "../assets/style.scss";
import FileSystem from "./FileSystem";

const fs = new FileSystem("wice");

fs.mkdir("me");
fs.cd("me");
fs.touch("about.txt", "I am a web developer");

const terminal = document.querySelector<HTMLDivElement>("#terminal")!;
const tabs = document.querySelector<HTMLDivElement>("#tabs")!;

terminal.addEventListener("click", () => {
  const input = document.querySelector<HTMLInputElement>(".activeInput");
  if (input) {
    input.focus();
  }
});

const createInput = () => {
  const box = document.createElement("div");
  const pwd = document.createElement("div");
  pwd.classList.add("pwd");
  pwd.innerHTML = fs.wd.name;
  box.appendChild(pwd);
  box.classList.add("box");
  const input = document.createElement("input") as HTMLInputElement;
  input.classList.add("activeInput");
  const previousInput =
    document.querySelector<HTMLInputElement>(".activeInput");
  if (previousInput) {
    previousInput.disabled = true;
    previousInput.classList.remove("activeInput");
  }
  box.appendChild(input);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      executeCommand(e.target.value);
      createInput();
      fs.historyState = 0;
    }
    if (e.key == "ArrowUp") {
      console.log((fs.historyState += 1));
    }
  });

  terminal.appendChild(box);
  input.focus();
};

const executeCommand = (command: string) => {
  fs.history.push(command);
  const [cmd, ...args] = command.split(" ");
  switch (cmd) {
    case "exit":
      location.reload();
    case "pwd":
      createOutput(fs.pwd());
      break;
    case "":
      createOutput("");
      break;
    case "wc":
      createOutput(fs.wc(args[0]) + "  ");
      break;
    case "mkdir":
      try {
        fs.mkdir(args[0]);
      } catch (err) {
        createOutput(err + "");
      }
      break;
    case "touch":
      fs.touch(args[0], args[1]);
      break;
    case "cat":
      try {
        createOutput(fs.cat(args[0]) + "  ");
      } catch (err) {
        createOutput(err + "  ");
      }
      break;
    case "ls":
      createOutput(
        fs
          .ls(args[0])
          .map((child) => {
            if (child.type === "folder")
              return `<span class="folder">${child.name}</span>`;
            else return `<span class="file">${child.name}</span>`;
          })
          .join(" ")
      );
      break;
    case "clear":
      terminal.innerHTML = "";
      break;
    case "cd":
      try {
        fs.cd(args[0]);
      } catch (err) {
        createOutput(err);
      }
      break;
    default:
      createOutput("Command not found");
      break;
  }
};
const createOutput = (text: string) => {
  const output = document.createElement("div");
  output.classList.add("output");
  output.innerHTML = text;
  terminal.appendChild(output);
};

window.onload = () => {
  createInput();
};
