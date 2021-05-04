window.onload = function () {

  document.getElementById("Export").addEventListener("click", function() {
    console.log("Megnyomtuk az exportot");

    var container = document.querySelector('#rete');

    var myNum = 100;
    var myNode = editor.nodes;

    console.log (myNode[0].id);

    console.log("fun times");


  });

}


// start 

// // Variable type node's output
// my @node1_string = "fdsaafadfsd";

// //OpenFile - param node1-tol ami string
// _node2_name(node1_string)

// my @node35_x = 1;
// my @node35_y = 1;
// my @node35_z = 1;

// _node3_name(node35_x, node35_y, node35_z)

// end