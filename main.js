var phi = [];
var Theta = [];
var N = 1;
var M = 1;
var delta = 0.01;
var epsilon = 0.01;
var isShowing = false;
var intervalID = null;
calcOptionalVariable();

function calcOptionalVariable(){
  N = Number($("#N").val());
  M = Number($("#M").val());
  delta = Number($("#delta").val());
  epsilon = Number($("#epsilon").val());
  $("#lambda-span").text((N*epsilon).toFixed(2));
}

var timeI = 0;

function show() {
  timeI = 0;
  intervalID = setInterval(showSVG, delta*1000);
}

function stop(){
  if(intervalID!=null){
    clearInterval(intervalID);
  }
}

function showSVG(){
  $("#svg").html("<text x='500' y='690'>ζ</text><text x='0' y='350'>Θ,φ</text><text x='120' y='20'>Θ</text><polyline stroke-width='2' stroke='#00f' points='135,15 200,15' /><text x='120' y='40'>φ</text><polyline stroke-width='2' stroke='#0f0' points='135,35 200,35' />");
  for(i=0; i<=10; i++){
    $("#svg").append("<polyline stroke-width='0.5' stroke='#000' points='100," + calcY(i/10) + " 1000," + calcY(i/10) + "' fill='none'/>");
    $("#svg").append("<text x='50' y='" + calcY(i/10) + "'>" + (i/10).toFixed(2) + "</text>");
    $("#svg").append("<polyline stroke-width='0.5' stroke='#000' points='" + (100 + i * 90) + ",50 " + (100 + i * 90) + ",650' fill='none'/>");
    $("#svg").append("<text x='" + (50 + i * 90) + "' y='670'>" + (i/10 * N * epsilon).toFixed(2) + "</text>");
  }
  var thetaString = "";
  var phiString = "";
  for (var i = 0; i < N; i++) {
    thetaString += (" " + (i * 900 / N + 100)  + "," + calcY(Theta[timeI][i]));
  }
  thetaString = thetaString.slice(1);
  for (var i = 0; i <= N; i++) {
    phiString += (" " + (i * 900 / N + 100) + "," + calcY(phi[timeI][i]));
  }
  phiString = phiString.slice(1);

  $("#svg").append("<polyline stroke-width='2' stroke='#0f0' points='" + phiString + "' fill='none'/>");
  $("#svg").append("<polyline stroke-width='2' stroke='#00f' points='" + thetaString + "' fill='none'/>");

  $("#svg").html( $("#svg").html() );
  timeI++;
  timeI = timeI % M;
}

function calcY(num){
  return 650 - 600 * num;
}