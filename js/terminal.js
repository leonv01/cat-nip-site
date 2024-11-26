class Terminal {
    static _instance = null;

    constructor() {
        if (Terminal._instance) {
            return Terminal._instance;
        }

        // Set references to HTML elements
        this.terminalContainer = document.getElementById("terminal-container");
        this.terminal = document.getElementById("terminal");
        this.cmdline = document.getElementById("cmdline");
        this.output = document.getElementById("output");
        this.prompt = document.getElementById("prompt");

        // Initialize state variables
        this.promptText = '@cat-nip:';
        this.typingSpeed = 50;
        this.maxInputSize = 50;
        this.maxHistorySize = 20;
        this.historyStack = [];
        this.historyTrack = 0;
        this.directories = {};
        this.currentDir = "home";
        this.userName = "user";
        this.commandDictionary = {};

        // Initialize commands and setup terminal events
        this.initializeCommands();
        this.setupEventListeners();

        // Load user and directory data
        this.loadUser();
        this.loadDirectories();
        this.loadCommandDictionary();

        Terminal._instance = this;
    }

    static getInstance() {
        if (!Terminal._instance) {
            Terminal._instance = new Terminal();
        }
        return Terminal._instance;
    }

    setPromptText(newName) {
        this.prompt.innerHTML = newName + this.promptText + this.currentDir + '$ ';
        this.userName = newName;
        localStorage.setItem('username', this.userName);
    }

    loadUser() {
        const savedUserName = localStorage.getItem('username');
        if (savedUserName) {
            this.setPromptText(savedUserName);
        } else {
            this.setPromptText(this.userName);
        }
    }

    loadDirectories() {
        fetch('./json/directories.json')
            .then(response => response.json())
            .then(data => { 
                this.directories = data.root;
                this.updateDirectory();
            })
            .catch(error => { console.error('Error loading directories', error); });
    }

    loadCommandDictionary() {
        fetch('./json/commands.json')
            .then(response => response.json())
            .then(data => { this.commandDictionary = data.commands; })
            .catch(error => { console.error('Error loading command dictionary', error); });
    }

    initializeCommands() {
        this.commands = {
            help: this.commandHelp.bind(this),
            clear: this.clearOutput.bind(this),
            echo: (args) => args.join(' '),
            ls: this.listDirectories.bind(this),
            neofetch: this.neoFetch.bind(this),
            cd: this.changeDirectory.bind(this),
            history: this.listHistory.bind(this),
            meow: () => this.typeText("meow :3"),
            commands: this.listCommands.bind(this),
            adduser: this.addUser.bind(this),
            removeuser: this.removeUser.bind(this),
            whoami: () => this.typeText(this.userName),
        };
    }

    setupEventListeners() {
        this.cmdline.addEventListener("keydown", this.enterCommand.bind(this));
        this.cmdline.addEventListener('input', this.resizeInput.bind(this));
        this.terminalContainer.addEventListener('click', () => this.cmdline.focus());

        document.addEventListener('DOMContentLoaded', () => {
            const savedContent = sessionStorage.getItem('terminalContent');
            const isFirstVisit = sessionStorage.getItem('isFirstVisit');
            
            if (!isFirstVisit) {
                this.startText();
                sessionStorage.setItem('isFirstVisit', 'false');
            }

            if (savedContent) {
                this.output.innerHTML = savedContent;
            }

            this.updateDirectory();
        });
    }

    typeText(text, typeSpeed = 50)
    {
        let index = 0;
        const span = document.createElement('span');
        let newLine = false;
        const lineStart = '>';
        
        span.className = 'command-output';
        span.innerHTML += '>';
        output.appendChild(span);

        function type()
        {
            if(index < text.length)
            {
                span.innerHTML += text.charAt(index);
                if(text.charAt(index) === '\n')
                {
                    span.innerHTML += lineStart;
                }
                index++;
                setTimeout(type, typeSpeed);

            }
            else
            {
                span.innerHTML += '<br>';
            }
        }
        type();
    }

    commandHelp(args)
    {
        if(args.length === 0)
        {
            let helpText = '';
            Object.keys(this.commandDictionary).forEach(command => 
            {
                helpText += (command + ": " + this.commandDictionary[command] + "\n");
            });
            if(helpText.endsWith("\n"))
            {
                helpText = helpText.slice(0, -1);
            }
            this.typeText(helpText, 1);
        }
        else
        {
            if (this.commandDictionary[args[0]]) {
                this.typeText(this.commandDictionary[args[0]]);
            } else {
                this.typeText(`No help available for ${args[0]}`);
            }
        }
    }

    neoFetch()
    {
        var OSName = 'Unknown OS';
    
        if(navigator.userAgent.indexOf('Win') != -1) OSName = 'Windows';
        if(navigator.userAgent.indexOf('Mac') != -1) OSName = 'MacOS';
        if(navigator.userAgent.indexOf('X11') != -1) OSName = 'UNIX';
        if(navigator.userAgent.indexOf('Linux') != -1) OSName = 'Linux';
        
        var browserName = 'Unknown browser';
    
        if((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) browserName = 'Opera';
        else if(navigator.userAgent.indexOf('Edge') != -1) browserName = 'Edge';
        else if(navigator.userAgent.indexOf('Chrome') != -1) browserName = 'Chrome';
        else if(navigator.userAgent.indexOf('Safari') != -1) browserName = 'Safari';
        else if(navigator.userAgent.indexOf('Firefox') != -1) browserName = 'Firefox';
        else if(navigator.userAgent.indexOf('MSIE') != -1) browserName = 'Internet Explorer';
    
        this.output.innerHTML += `<span class="command-output">You are running on: ${OSName} with ${browserName}</span><br>`;
    }

    startText()
    {
        let savedUserName = localStorage.getItem('username');
        if(savedUserName === null)
            savedUserName = "user";

        this.typeText("Welcome " + savedUserName + "! Set your username using the command 'adduser'. You can use 'commands' to orient yourself through different pages. If you need help for each command, use 'help [command] to learn more about the command. Have fun!", 0.1);
    }

    listCommands()
    {
        if(this.commands)
        {
            Object.keys(this.commands).forEach(command => {
                this.typeText(command);
            });
        }
    }

    listDirectories()
    {
        const directoryKeys = Object.keys(this.directories);

        if(directoryKeys.length > 0)
        {
            let outputText = '';
            directoryKeys.forEach(key => {
                outputText += key + '\n';
            });
            if(outputText.endsWith('\n'))
            {
                outputText = outputText.slice(0, -1);
            }

            this.typeText(outputText, 20);
        }
        else
        {
            this.typeText("No directories found");
        }
    }

    listHistory(args)
    {
        if(this.historyStack && typeof(args[0] === Number))
        {
            for (let index = 0; index < this.historyStack.length; index++) 
            {
                if(index >= args[0]) break;
                const element = this.historyStack[index];
                this.typeText(element)              
            }
        }
    }

    clearOutput()
    {
        this.output.innerHTML = '';
        sessionStorage.removeItem('terminalContent');
    }

    changeDirectory(args)
    {
        if(args.length === 0 || args[0] === '~' || args[0] === 'home' || args[0] === 'root' || args[0] === 'cat-nip' || args[0] === 'catnip' || args[0] === 'cat_nip' || args[0] === '..')
        {
            window.location.href = 'index.html';
        }
        const newDir = args[0];
        sessionStorage.setItem('terminalContent', this.output.innerHTML);
        
        window.location.href = this.directories[newDir];
        return `Opened ${newDir}`;
    }

    addUser(args)
    {
        if(args.length === 0)
        {
            return;
        }
        else
        {
            this.setPromptText(args[0]);
            this.typeText("User [" + this.userName + "] added.");
        }
    }

    removeUser()
    {
        this.setPromptText(this.userName)
    }

    enterCommand(e)
    {
        if(e.key === 'Enter')
        {
            const input = cmdline.value.trim();
            const [command, ...args] = input.split(' ');

            this.cmdline.value = '';
            this.historyStack[this.historyTrack] = input;
            this.historyTrack = (this.historyTrack + 1) % this.maxHistorySize;

            this.output.innerHTML += `<span class="command-output-prompt">${this.prompt.innerHTML}${input}</span><br>`;

            if(this.commands[command])
            {
                const result = typeof this.commands[command] === 'function' ? this.commands[command](args) : this.commands[command];

                if(result)
                {
                    this.typeText(result);
                }
            }
            else
            {
                this.typeText("Command not found: " + command);
            }

            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    resizeInput()
    {
        const newSize = this.cmdline.value.length + 1;
        this.cmdline.style.width = (newSize > this.maxInputSize ? this.maxInputSize : newSize) + "ch";
    }

    updateDirectory()
    {
        const directoryKeys = Object.keys(this.directories);
        const currentPage = window.location.pathname;

        if(directoryKeys.length > 0)
        {
            directoryKeys.forEach(key => {
                const directory = this.directories[key];
                if(currentPage.includes(directory))
                {
                    if(key === 'home')
                    {
                        this.currentDir = '~';
                    }
                    else
                    {
                        this.currentDir = "~/" + key;
                    }
                    this.changePrompt();
                }
            });
        }
    }

    changePrompt()
    {
        this.prompt.innerHTML = this.userName + this.promptText + this.currentDir + '$ ';
    }
}

// Initialize the terminal singleton instance
const terminal = Terminal.getInstance();
