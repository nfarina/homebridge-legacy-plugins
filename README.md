
# Homebridge Legacy Plugins

This repository contains all the plugins that were previously bundled in the main `homebridge` repository. These should all be moved to separate repositories owned by their original creators/maintainers.

# Installation

This plugin is published via [NPM](https://www.npmjs.com/package/homebridge-legacy-plugins) and should be installed "globally" by typing:

    npm install -g homebridge-legacy-plugins

You may have to execute commands with `sudo` depending on your system. Now you should be able to run Homebridge:

    Loaded plugin: homebridge-legacy-plugins
    Registering accessory 'homebridge-legacy-plugins.AD2USB'
    Registering accessory 'homebridge-legacy-plugins.Carwings'
    ...many more

# Where Did That Plugin Go?

As authors of the legacy accessories and platforms create new standalone plugins, we'll be removing them from this legacy package.

Here's what has been removed so far, along with a link to the replacement plugin:

  * [isy-js](https://github.com/rodtoll/homebridge-isy-js)
  * [KNX](https://github.com/snowdd1/homebridge-knx)
  * [Netatmo](https://github.com/planetk/homebridge-netatmo)

