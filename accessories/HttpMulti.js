//switch and lock to set up
var types = require("../api").homebridge.hapLegacyTypes;

var request = require("request");

function HttpMulti(log, config) {
  this.log = log;
  this.up_url = config["up_url"];
  this.down_url = config["down_url"];
  this.on_url = config["on_url"];
  this.off_url = config["off_url"];
  this.lock_url = config["lock_url"];
  this.unlock_url = config["unlock_url"];
  this.brightness_url = config["brightness_url"];
  this.name = config["name"];
  this.deviceID = config["device_id"];
  this.canDim = config["can_dim"];
  this.deviceType = config["deviceType"]
  this.serviceName = config["serviceName"];
  if (this.serviceName === undefined) this.serviceName = this.name 
  this.manufacturer = config["accessory"];
  if (this.manufacturer === undefined) this.manufacturer = "HttpMulti inc.";
  this.model = config["model"];
  if (this.model === undefined) this.model = this.deviceType;
  this.serialNum = config["serialNum"];
  if (this.serialNum === undefined) this.serialNum = this.deviceType+"."+this.name;
  this.log("HttpMulti Initialization complete for "+this.deviceType+" "+this.name);

}


HttpMulti.prototype = {

  setPowerState: function(powerOn) {

    var that = this;
    if (this.deviceType == "blind") {
    	var myURL = powerOn ? this.up_url : this.down_url ;
    	
	} else if (this.deviceType == "garagedoor") {
		var myURL = powerOn ? this.down_url : this.up_url ;  
		  	
	} else if (this.deviceType == "lock") {
		var myURL = powerOn ? this.lock_url : this.unlock_url ;
		
    } else {
    	var myURL = powerOn ? this.on_url : this.off_url ;
	}    

    this.log("URL = "+myURL);
    this.log("Setting "+this.deviceType+" state to " + powerOn);

	// Add in put method
    request.get({
           //url: "http://"+this.user + ":" + this.pass + "@" + this.host + ":" + this.port + "/" +"3?0262" + this.deviceID + command + onOffState+ "=I=3",
           url: myURL,

   }, function(err, response, body) {

       if (!err && response.statusCode == 200) {
         that.log("State change sent to http module.");
       }
       else {
        that.log("Some errors...happened please try again");
       }
     });

  },


  setBrightnessLevel: function(value) {

    var that = this;

    levelInt = parseInt(value)*255/100;
    var intvalue = Math.ceil( levelInt );
    var hexString2 = ("0" + intvalue.toString(16)).substr(-2);

	var myURL = this.brightness_url;
	
	// replace %VALUE% with value in the URL
	myURL = myURL.replace("%VALUE%",value);
	
    this.log(myURL);
    this.log("Setting brightness level of "+this.deviceType+" to "+value);

    request.get({
       url: myURL,
    }, function(err, response, body) {

       if (!err && response.statusCode == 200) {
         that.log("State change complete.");
       }
       else {
         that.log("Error '"+err+"' setting brightness level: " + body);
       }
     });
  },

  getServices: function() {
    var that = this;
    var myType = types.LIGHTBULB_STYPE;
    var services;

    if (this.deviceType == "lightBulb") {
      myType = types.LIGHTBULB_STYPE;
      services = [{
      sType: types.ACCESSORY_INFORMATION_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.name,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Name",
          designedMaxLength: 255
      },{
          cType: types.MANUFACTURER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.manufacturer,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Manufacturer",
          designedMaxLength: 255
      },{
          cType: types.MODEL_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.model,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Model",
          designedMaxLength: 255
      },{
          cType: types.SERIAL_NUMBER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serialNum,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Serial Number",
          designedMaxLength: 255
      },{
          cType: types.IDENTIFY_CTYPE,
          onUpdate: null,
          perms: ["pw"],
          format: "bool",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Identify Accessory",
          designedMaxLength: 1
      }]
      },{
      sType: types.LIGHTBULB_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serviceName,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Service Name",
          designedMaxLength: 255
      },{
          cType: types.BRIGHTNESS_CTYPE,
          onUpdate: function(value) {
            console.log(that.name + "...changing brightness....");
            that.setBrightnessLevel(value);
             },
          perms: ["pw","pr","ev"],
          format: "bool",
          initialValue: 100,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Adjust Brightness",
          designedMinValue: 0,
          designedMaxValue: 100,
          designedMinStep: 1,
          unit: "%"
      },{      
          cType: types.POWER_STATE_CTYPE,
          onUpdate: function(value) {
            console.log(that.name + "...changing status....");
            that.setPowerState(value);
             },
          perms: ["pw","pr","ev"],
          format: "bool",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Change the power state of light",
          designedMaxLength: 1
      }]
    }];         
    }
    if (this.deviceType == "fan") {
      myType = types.FAN_STYPE;
      services = [{
      sType: types.ACCESSORY_INFORMATION_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.name,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Name",
          designedMaxLength: 255
      },{
          cType: types.MANUFACTURER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.manufacturer,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Manufacturer",
          designedMaxLength: 255
      },{
          cType: types.MODEL_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.model,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Model",
          designedMaxLength: 255
      },{
          cType: types.SERIAL_NUMBER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serialNum,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Serial Number",
          designedMaxLength: 255
      },{
          cType: types.IDENTIFY_CTYPE,
          onUpdate: null,
          perms: ["pw"],
          format: "bool",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Identify Accessory",
          designedMaxLength: 1
      }]
      },{
      sType: types.FAN_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serviceName,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Service Name",
          designedMaxLength: 255
      },{
          cType: types.POWER_STATE_CTYPE,
          onUpdate: function(value) {
            console.log(that.name + "...changing status....");
            that.setPowerState(value);
             },
          perms: ["pw","pr","ev"],
          format: "bool",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Change the power state of fan",
          designedMaxLength: 1
      }]
    }];
      
    }
    if (this.deviceType == "switch") {
      myType = types.SWITCH_STYPE;
    }
    if (this.deviceType == "lock") {
      myType = types.LOCK_MECHANISM_STYPE;
     services = [{
      sType: types.ACCESSORY_INFORMATION_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.name,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Name",
          designedMaxLength: 255
      },{
          cType: types.MANUFACTURER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.manufacturer,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Manufacturer",
          designedMaxLength: 255
      },{
          cType: types.MODEL_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.model,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Model",
          designedMaxLength: 255
      },{
          cType: types.SERIAL_NUMBER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serialNum,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Serial Number",
          designedMaxLength: 255
      },{
          cType: types.IDENTIFY_CTYPE,
          onUpdate: null,
          perms: ["pw"],
          format: "bool",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Identify Accessory",
          designedMaxLength: 1
      }]
      },{
    sType: types.LOCK_MECHANISM_STYPE, 
    characteristics: [{
    	cType: types.NAME_CTYPE,
    	onUpdate: null,
    	perms: ["pr"],
		format: "string",
		initialValue: "Lock Mechanism",
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "Name of service",
		designedMaxLength: 255   
    },{
    	cType: types.CURRENT_LOCK_MECHANISM_STATE_CTYPE,
    	onUpdate: function(value) {
            console.log(that.name + "...current status....");
            that.setPowerState(value);
             },
    	perms: ["pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "BlaBla",
		designedMinValue: 0,
		designedMaxValue: 3,
		designedMinStep: 1,
		designedMaxLength: 1    
    },{
    	cType: types.TARGET_LOCK_MECHANISM_STATE_CTYPE,
    	onUpdate: function(value) {
            console.log(that.name + "...changing status....");
            that.setPowerState(value);
             },
    	perms: ["pr","pw","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "BlaBla",
		designedMinValue: 0,
		designedMaxValue: 1,
		designedMinStep: 1,
		designedMaxLength: 1    
      }]
    }];    
    }    
    if (this.deviceType == "blind") {
      myType = types.WINDOW_COVERING_STYPE;
      services = [{
      sType: types.ACCESSORY_INFORMATION_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.name,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Name",
          designedMaxLength: 255
      },{
          cType: types.MANUFACTURER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.manufacturer,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Manufacturer",
          designedMaxLength: 255
      },{
          cType: types.MODEL_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.model,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Model",
          designedMaxLength: 255
      },{
          cType: types.SERIAL_NUMBER_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serialNum,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Serial Number",
          designedMaxLength: 255
      },{
          cType: types.IDENTIFY_CTYPE,
          onUpdate: null,
          perms: ["pw"],
          format: "bool",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Identify Accessory",
          designedMaxLength: 1
      }]
      },{
      sType: types.WINDOW_COVERING_STYPE,
      characteristics: [{
          cType: types.NAME_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "string",
          initialValue: this.serviceName,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Service Name",
          designedMaxLength: 255
      },{
          cType: types.WINDOW_COVERING_CURRENT_POSITION_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "int",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Window cover current position",
          designedMinValue: 0,
          designedMaxValue: 100,
          unit: "%"
      },{
          cType: types.WINDOW_COVERING_TARGET_POSITION_CTYPE,
          onUpdate: function(value) {
            console.log(that.name + "...changing status....");
            that.setPowerState(value);
             },
          perms: ["pw","pr","ev"],
          format: "int",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Window cover target position",
          designedMinValue: 0,
          designedMaxValue: 100,
          designedMinStep: 1,
          unit: "%"
      },{
          cType: types.WINDOW_COVERING_OPERATION_STATE_CTYPE,
          onUpdate: null,
          perms: ["pr"],
          format: "int",
          initialValue: false,
          supportEvents: false,
          supportBonjour: false,
          manfDescription: "Window cover operation state",
          designedMinValue: 0,
          designedMaxValue: 100,
          unit: "%"
      }]
    }];
      
    }
    if (this.deviceType == "garagedoor") {
      myType = types.GARAGE_DOOR_OPENER_STYPE;
      services = [{
      sType: types.ACCESSORY_INFORMATION_STYPE,
      characteristics: [{
        cType: types.NAME_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: this.name,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Name of the accessory",
        designedMaxLength: 255
      },{
        cType: types.MANUFACTURER_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "Http",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Manufacturer",
        designedMaxLength: 255
      },{
        cType: types.MODEL_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "Rev-1",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Model",
        designedMaxLength: 255
      },{
        cType: types.SERIAL_NUMBER_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: "A1S2NASF88EW",
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "SN",
        designedMaxLength: 255
      },{
        cType: types.IDENTIFY_CTYPE,
        onUpdate: null,
        perms: ["pw"],
        format: "bool",
        initialValue: false,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Identify Accessory",
        designedMaxLength: 1
      }]
    },{
      sType: types.GARAGE_DOOR_OPENER_STYPE,
      characteristics: [{
        cType: types.NAME_CTYPE,
        onUpdate: null,
        perms: ["pr"],
        format: "string",
        initialValue: this.name,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Name of service",
        designedMaxLength: 255
      },{
 	cType: types.CURRENT_DOOR_STATE_CTYPE,
    	onUpdate: function(value) { 
    		console.log("Garage Door - current door state Change"+value); 
    	},
    	onRead: function(callback) {
    		console.log("Garage Door - current door state Read");
    		callback(undefined); // only testing, we have no physical device to read from
    	},
    	perms: ["pr","ev"],
		format: "int",
		initialValue: 0,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "BlaBla",
		designedMinValue: 0,
		designedMaxValue: 4,
		designedMinStep: 1,
		designedMaxLength: 1    
	},{
        cType: types.TARGET_DOORSTATE_CTYPE,
        onUpdate: function(value) { that.setPowerState(value); },
        perms: ["pw","pr","ev"],
        format: "int",
        initialValue: 0,
        supportEvents: false,
        supportBonjour: false,
        manfDescription: "Change the door state",
	designedMinValue: 0,
	designedMaxValue: 1,
	designedMinStep: 1,
        designedMaxLength: 1
      },{
    	cType: types.OBSTRUCTION_DETECTED_CTYPE,
    	onUpdate: function(value) { 
    		console.log("Garage Door Obstruction Change:",value); 
    	},
    	onRead: function(callback) {
    		console.log("Garage Door Obstruction Read:");
    	},
    	perms: ["pr","ev"],
		format: "bool",
		initialValue: false,
		supportEvents: false,
		supportBonjour: false,
		manfDescription: "BlaBla",
      }]
    }];
    }

 
    return services;
  }
};

module.exports.accessory = HttpMulti;
