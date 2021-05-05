var editor;
var engine;

const test_types = {
	DEFAULT: "default_test_template",
	DATA_DRIVEN: "datadriven_test_template",
	SPEED: "speed_test_template"
}

var state = {
  type: test_types.DEFAULT
};

var components = [
  new NumComponent (), 
  new StrComponent (), 
  new Coord2DComponent (), 
  new Coord3DComponent (), 
  new SimpleComponent (''), 
  new BeginComponent (), 
  new EndComponent ()
];

var simple_command_descriptors = [];
