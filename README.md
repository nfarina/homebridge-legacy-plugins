
# Homebridge Legacy Plugins

This repository contains all the plugins that were previously bundled in the main `homebridge` repository. These should all be moved to separate repositories owned by their original creators/maintainers.

# Installation

**NOTE**: If you are running on a linux machine (like Raspberry Pi), you will need to first install the Kerberos development libraries:

```sh
    sudo apt-get install libkrb5-dev
```

This plugin is published via [NPM](https://www.npmjs.com/package/homebridge-legacy-plugins) and should be installed "globally" by typing:

    sudo npm install -g homebridge-legacy-plugins

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
  * [Fibaro Home Center 2](https://github.com/ilcato/homebridge-Fibaro-HC2)
  * [HTTP](https://github.com/rudders/homebridge-http)
  * [Nest](https://github.com/kraigm/homebridge-nest)
  * [HomeMatic Platform](https://github.com/thkl/homebridge-homematic)
  * [Philips Hue](https://github.com/thkl/homebridge-philipshue)
  * [FHEM](https://github.com/justme-1968/homebridge-fhem.git)
  * [Sonos](https://github.com/nfarina/homebridge-sonos)
  * [Indigo](https://www.npmjs.com/package/homebridge-indigo)
  * [Logitech Harmony](https://www.npmjs.com/package/homebridge-harmonyhub)
  * [Telldus](https://github.com/johngson/homebridge-telldus)
  * [Hyperion](https://github.com/danimal4326/homebridge-hyperion)
  * [WeMo](https://github.com/rudders/homebridge-wemo)
  * [iControl](https://github.com/nfarina/homebridge-icontrol)
  * [LiftMaster](https://github.com/nfarina/homebridge-liftmaster)
  * [Lockitron](https://github.com/nfarina/homebridge-lockitron)