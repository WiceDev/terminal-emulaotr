export default class FileSystem {
  name: string;
  children: Folder[];
  wd: Folder;
  history: string[];
  user: string;
  historyState: number;
  constructor(name: string) {
    this.name = name;
    this.user = "wice";
    this.history = [];
    this.historyState = 0;
    this.children = [
      {
        name: "~",
        type: "folder",
        children: [],
        parent: null,
      },
    ];
    this.wd = this.children[0];
  }
  pwd() {
    var folders = [];
    var wd = this.wd;
    while (wd) {
      folders.push(wd.name);
      wd = wd.parent;
    }
    return folders.reverse().join("/") + "/";
  }
  wc(name: string) {
    const file = this.wd.children.find(
      (child) => child.name === name && child.type === "file"
    );
    if (file) {
      return file.content.length;
    }
  }

  mkdir(name: string) {
    if (
      this.wd.children.find(
        (child: Folder | File) => child.name === name && child.type === "folder"
      )
    ) {
      throw Error("File or directory already exists");
    }
    const newFolder = new Folder(name, this.wd);
    this.wd.children.push(newFolder);
    return "";
  }
  touch(name: string, content: string) {
    const newFile = new File(name, content, this.wd);
    this.wd.children.push(newFile);
  }
  cat(name: string) {
    const file = this.wd.children.find(
      (child) => child.name === name && child.type === "file"
    );
    if (file) {
      return file.content + "  ";
    } else {
      throw Error("No such file or directory");
    }
  }
  ls(arg: string) {
    if (arg == "-a") return this.wd.children;
    else {
      return this.wd.children.filter((child) => {
        return !child.hidden;
      });
    }
  }
  cd(name: string) {
    if (name) {
      const folder: Folder = this.wd.children.find(
        (child) => child.name === name && child.type === "folder"
      ) as Folder;
      if (name === "..") {
        this.wd = this.wd.parent || this.wd;
      } else if (name === ".") {
      } else if (folder) {
        this.wd = folder;
      } else {
        throw Error("No such file or directory");
      }
    }
  }
}

class File {
  name: string;
  type: string;
  content: string;
  hidden: boolean;
  parent: Folder;

  constructor(name: string, content = "", parent: Folder) {
    this.hidden = false;
    if (name.startsWith(".")) {
      this.hidden = true;
    }
    this.name = name;
    this.type = "file";
    this.content = content;
    this.parent = parent;
  }
}

class Folder {
  name: string;
  type: string;
  content: string;
  hidden: boolean;
  children: (Folder | File)[];
  parent: Folder;
  constructor(name: string, parent: Folder) {
    this.hidden = false;
    if (name.startsWith(".")) {
      this.hidden = true;
    }
    this.content = "";
    this.name = name;
    this.type = "folder";
    this.children = [];
    this.parent = parent;
  }
}
