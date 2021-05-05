var editor;
var engine;

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
