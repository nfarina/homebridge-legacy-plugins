// HTTP Multiple object. Used for simple integration into backends such as Misterhouse
// TODO
// - thermostat object
// - how to query status of objects and feed that back to homebridge

//Fan
// Set the fan to [on,off,low,medium,high]


var types = require("../api").homebridge.hapLegacyTypes;

var request = require("request");

function HttpMulti(log, config) {
  this.log = log;
  this.up_url = config["up_url"];
  this.down_url = config["down_url"];
  this.open_url = config["open_url"];
  this.close_url = config["close_url"];  
  this.on_url = config["on_url"];
  this.off_url = config["off_url"];
  this.lock_url = config["lock_url"];
  this.unlock_url = config["unlock_url"];
  this.brightness_url = config["brightness_url"];
  if (this.brightness_url === undefined) this.brightness_url = config["speed_url"];
  if (this.brightness_url === undefined) this.brightness_url = config["setpoint_url"];
  this.setpoint_url = config["setpoint_url"];
  this.gettemp_url = config["gettemp_url"];
  this.status_url = config["status_url"];
  this.name = config["name"];
  this.deviceType = config["deviceType"];
  this.method = config["http_method"];
  if (this.method === undefined) this.method = "GET";
  this.serviceName = config["serviceName"];
  if (this.serviceName === undefined) this.serviceName = this.name;
  this.manufacturer = config["accessory"];
  this.model = config["model"];
  if (this.model === undefined) this.model = this.deviceType;
  this.serialNum = config["serialNum"];
  if (this.serialNum === undefined) {
  	var hash;
  	for (var i = 0; i < this.name.length; i++) {
  		var character  = this.name.charCodeAt(i);
        hash  = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
  	this.serialNum = "X"+Math.abs(hash);
  }
  this.log("HttpMulti Initialization complete for "+this.deviceType+":"+this.name+":"+this.serialNum);
}


HttpMulti.prototype = {

  setPowerState: function(powerOn) {

    var that = this;
    if (this.deviceType.toUpperCase() == "BLIND") {
    	var myURL = powerOn ? this.up_url : this.down_url ;
    	
	} else if (this.deviceType.toUpperCase() == "GARAGEDOOR") {
		var myURL = powerOn ? this.close_url : this.open_url ;  
		  	
	} else if (this.deviceType.toUpperCase() == "LOCK") {
		var myURL = powerOn ? this.lock_url : this.unlock_url ;
		
    } else if (this.deviceType.toUpperCase() == "SWITCH" ||
    			this.deviceType.toUpperCase() == "LIGHTBULB" ||
    			this.deviceType.toUpperCase() == "FAN" ||
    			this.deviceType.toUpperCase() == "THERMOSTAT" ) {
    	var myURL = powerOn ? this.on_url : this.off_url ;
	} else {
		this.log("Unknown device Type "+this.deviceType);
	}

    this.log("URL = "+myURL);
    this.log("Setting "+this.deviceType+" state to " + powerOn);

	if (this.method.toUpperCase() == "POST") {
    	request.post({
           url: myURL,
  		 }, function(err, response, body) {

       		if (!err && response.statusCode == 200) {
         		that.log("State change sent to http module.");
       		} else {
        		that.log("Some errors...happened please try again");
       		}
     	});
     } else {
    	request.get({
           url: myURL,
  		 }, function(err, response, body) {

       		if (!err && response.statusCode == 200) {
         		that.log("State change sent to http module.");
       		} else {
        		that.log("Some errors...happened please try again");
       		}
     	});
     }

  },


  setBrightnessLevel: function(value) {

    var that = this;

	var myURL = this.brightness_url;
	if (myURL === undefined) {
		this.log("Error, brightness/speed/setpoint URL not defined!");
	} else {
		// replace %VALUE% with value in the URL
		myURL = myURL.replace("%VALUE%",value);
	
    	this.log(myURL);
    	this.log("Setting brightness level of "+this.deviceType+" to "+value);

		if (this.method.toUpperCase() == "POST") {
    		request.post({
           	url: myURL,
  		 	}, function(err, response, body) {

       		if (!err && response.statusCode == 200) {
         		that.log("State change sent to http module.");
       		} else {
        		that.log("Some errors...happened please try again");
       		}
     		});
     	} else {

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
     }
	}
  },

  getServices: function() {
    var that = this;
    var services = [{
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
    }];

    if (this.deviceType.toUpperCase() == "LIGHTBULB" || this.deviceType.toUpperCase() == "LIGHT" )  {
   	services.push({
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
    });       
    }
    
    if (this.deviceType == "fan") {
      services.push({
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
       		cType: types.ROTATION_SPEED_CTYPE,
            perms: ["pw","pr","ev"],
            format: "bool",
            initialValue: 0,
            supportEvents: true,
            supportBonjour: false,
            manfDescription: "Change the speed of the fan",
            designedMaxLength: 1,
            onUpdate: function(value) {
                console.log(that.name + "...changing speed to "+value+" ....");
                if (value == 0) {
                    that.setPowerState(0);
                } else if (value > 0 && value < 40) {
                    that.setBrightnessLevel("low");
                } else if (value > 40 && value < 75) {
                    that.setBrightnessLevel("med");
                } else {
                    that.setBrightnessLevel("high");
                }
            }
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
    });    
    }
    
    if (this.deviceType.toUpperCase() == "SWITCH") {
   	services.push({
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
          manfDescription: "Change the power state of switch",
          designedMaxLength: 1
      }]
    });       
    }
    
    if (this.deviceType.toUpperCase() == "LOCK") {
     services.push({
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
    });    
    }    
    
    if (this.deviceType == "blind") {
      services.push({
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
    });     
    }
    
    if (this.deviceType.toUpperCase() == "GARAGEDOOR") {
      services.push({
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
    		//callback(undefined); // only testing, we have no physical device to read from
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
    });
    }

    if (this.deviceType.toUpperCase() == "THERMOSTAT") {
      services.push({
    sType: types.THERMOSTAT_STYPE, 
    characteristics: [{
      cType: types.NAME_CTYPE,
      onUpdate: null,
      perms: ["pr"],
      format: "string",
      initialValue: this.name,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Bla",
      designedMaxLength: 255   
    },{
      cType: types.CURRENTHEATINGCOOLING_CTYPE,
      onUpdate: function(value) { 
        console.log("Current HC Change:",value); 
      },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 0,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Current Mode",
      designedMaxLength: 1,
      designedMinValue: 0,
      designedMaxValue: 2,
      designedMinStep: 1,    
    },{
      cType: types.TARGETHEATINGCOOLING_CTYPE,
      onUpdate: function(value) { 
        console.log("Target HC Change:",value); 
      },
      perms: ["pw","pr","ev"],
      format: "int",
      initialValue: 0,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Target Mode",
      designedMinValue: 0,
      designedMaxValue: 3,
      designedMinStep: 1,
    },{
      cType: types.CURRENT_TEMPERATURE_CTYPE,
      onUpdate: function(value) { 
        console.log("Current Temp Change:",value); 
      },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 20,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Current Temperature",
      unit: "celsius"
    },{
      cType: types.TARGET_TEMPERATURE_CTYPE,
      onUpdate: function(value) { 
        console.log("Target Temp Change:",value); 
        that.setBrightnessLevel(value);
      },
      perms: ["pw","pr","ev"],
      format: "int",
      initialValue: 20,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Target Temperature",
      designedMinValue: 16,
      designedMaxValue: 38,
      designedMinStep: 1,
      unit: "celsius"
    },{
      cType: types.TEMPERATURE_UNITS_CTYPE,
      onUpdate: function(value) { 
        console.log("Unit Change:",value); 
      },
      perms: ["pr","ev"],
      format: "int",
      initialValue: 0,
      supportEvents: false,
      supportBonjour: false,
      manfDescription: "Unit"
      }]
    });     
    }

    return services;
  }
};

module.exports.accessory = HttpMulti;
