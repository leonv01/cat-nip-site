class MenuRibbon
{
    static _instance = null;
    directories = {};

    constructor()
    {
        this.ribbon = document.getElementById('menu-ribbon');
        MenuRibbon._instance = this;
    }

    async loadDirectories()
    {
        if(Object.keys(this.directories).length > 0)
        {   
            return;
        }
        else
        {
            try
            {
                const response = await fetch('./json/directories.json');
                const data = await response.json(); 
                this.directories = data.root;
                this.createRibbon();
            }
            catch(error)
            {
                console.error('Error loading directories', error);
            }
        }
    }

    createRibbon()
    {
        const directoryKeys = Object.keys(this.directories);
        const currentPage = window.location.pathname;

        if(directoryKeys.length > 0)
        {
            directoryKeys.forEach(key => {
                const directory = this.directories[key];
                const directoryButton = document.createElement('button');
                directoryButton.textContent = key;
                directoryButton.classList.add('directory-button');

                if(currentPage.includes(directory))
                {
                    directoryButton.classList.add('active');
                }

                directoryButton.addEventListener('click', () => {
                    window.open(directory, '_self');
                });
                this.ribbon.appendChild(directoryButton);
            });
        }
        else
        {
            console.error('No directories found');
        }

       // this.createSettingsDropdown();
    }
    
    createSettingsDropdown()
    {
        const settingsDropdown = document.createElement('div');
        settingsDropdown.id = 'settings-dropdown';
        settingsDropdown.classList.add('dropdown');
        //settingsDropdown.style.display = 'none';

        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'Settings';
        settingsButton.classList.add('settings-button');
        settingsButton.addEventListener('click', this.toggleSettings);

        const settingsContent = document.createElement('div');
        settingsContent.classList.add('dropdown-content');

        const settingsList = ['Settings', 'About', 'Help'];

        settingsList.forEach(setting => {
            const settingHref = document.createElement('a');
            settingHref.textContent = setting;
            settingHref.href = '#';
            settingsContent.appendChild(settingHref);
        });

        settingsDropdown.appendChild(settingsButton);
        settingsDropdown.appendChild(settingsContent);

        this.ribbon.appendChild(settingsDropdown);
    }

    toggleSettings()
    {

    }

    static getInstance()
    {
        if(!MenuRibbon._instance)
        {
            MenuRibbon._instance = new MenuRibbon();
        }    
        return MenuRibbon._instance
    }
}

const menuRibbon = MenuRibbon.getInstance();
menuRibbon.loadDirectories();
