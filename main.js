var phi = [];
var Theta = [];
var N = 1;
var M = 1;
var delta = 0.01;
var epsilon = 0.01;
var nu = 0.1;
var lambda_r = 1;
var isShowing = false;
var intervalID = null;
var paramData = {};
window.onload = function(){
  setParam();
}

function initializePhiTheta(j0, nu, lambda_r) {
  phi = [[1, 1-epsilon]];
  for (let i=1; i<N; i++) {
    phi[0].unshift( (2 + ( j0 - nu*lambda_r*(1 - Math.exp(-(N-i-1)*epsilon/lambda_r)) )*epsilon*epsilon )*phi[0][0] - phi[0][1] );
  }
  Theta = [[]];
  for(let i=0; i<N; i++){
    Theta[0].push( (phi[0][i] - phi[0][i+1]) / epsilon / phi[0][i]);
  }
  const phi_0 = phi[0][0];
  for (let i=0; i<=N; i++) {
    phi[0][i] = phi[0][i] / phi_0;
  }
  if(Theta[0][0] > 1){
    phi = [[1, 1-epsilon]];
    for (let i=1; i<N; i++) {
      phi[0].push( (2 + ( j0 - nu*lambda_r*(1 - Math.exp(-i*epsilon/lambda_r)) )*epsilon*epsilon )*phi[0][i] - phi[0][i-1] );
    }
    Theta = [[]];
    for(let i=0; i<N; i++){
      Theta[0].push( (phi[0][i] - phi[0][i+1]) / epsilon / phi[0][i]);
    }
  }
}

function setParam(){
  var paramVal = "";
  paramVal = getParam("N");
  if(paramVal != null){
    $("#N").val(paramVal);
  }
  paramVal = getParam("M");
  if(paramVal!= null){
    $("#M").val(paramVal);
  }
  paramVal = getParam("delta");
  if(paramVal!= null){
    $("#delta").val(paramVal);
  }
  paramVal = getParam("epsilon");
  if(paramVal!= null){
    $("#epsilon").val(paramVal);
  }
  paramVal = getParam("lambda_r");
  if(paramVal!= null){
    $("#lambda_r").val(paramVal);
  }
  paramVal = getParam("nu");
  if(paramVal!= null){
    $("#nu").val(paramVal);
  }
  paramVal = getParam("j_0");
  if(paramVal!= null){
    $("#j_0").val(paramVal);
  }
  paramVal = getParam("sin_0");
  if(paramVal!= null){
    $("#sin_0").val(paramVal);
  }
  paramVal = getParam("cos_0");
  if(paramVal!= null){
    $("#cos_0").val(paramVal);
  }
  paramVal = getParam("sin_l");
  if(paramVal!= null){
    $("#sin_l").val(paramVal);
  }
  paramVal = getParam("cos_l");
  if(paramVal!= null){
    $("#cos_l").val(paramVal);
  }
  paramVal = getParam("T");
  if(paramVal!= null){
    $("#T").val(paramVal);
  }
  calcOptionalVariable();
}

function getParam(name) {
  if(Object.keys(paramData).length == 0){
    const params = $(location).attr("search");
    for(let param of params.slice(1).split("&")){
      if(param != ""){
        let parameters = param.split("=");
        paramData[parameters[0]] = parameters[1];
      }
    }
  }
  return paramData[name];
}

function calcOptionalVariable(){
  N = Number($("#N").val());
  M = Number($("#M").val());
  delta = Number($("#delta").val());
  epsilon = Number($("#epsilon").val());
  $("#lambda-span").text((N*epsilon).toFixed(2));
  const j_l_const = Number($("#j_l").val());
  const nu = Number($("#nu").val());
  const lambda_r = Number($("#lambda_r").val());
  const j_0_const = j_l_const + nu*lambda_r*(1-Math.exp(-N*epsilon/lambda_r));
  $("#J0-span").text((j_0_const).toFixed(2));
  $("#time-range").attr("min", 0).attr("max", M).val(timeI).css("width", "50%");
}

function changeTime() {
  timeI = Number($("#time-range").val());
}

var timeI = 0;

function show() {
  var min = 1;
  var max = 0;
  for(let theta of Theta){
    var m = Math.min(...theta);
    if(min > m){
      min = m;
    }
    m = Math.max(...theta);
    if(max < m){
      max = m;
    }
  }
  $("#values").text([min,max].toString());
  timeI = 0;
  intervalID = setInterval(showSVG, delta*1000);
}

function stop(){
  if(intervalID!=null){
    clearInterval(intervalID);
  }
}

function showSVG(){
  $("#svg").html("<text x='500' y='690'>ζ</text><text x='0' y='350'>Θ,φ</text><text x='120' y='20'>Θ</text><polyline stroke-width='2' stroke='#00f' points='135,15 200,15' /><text x='120' y='40'>φ</text><polyline stroke-width='2' stroke='#0f0' points='135,35 200,35' /><text x='500' y='35'>t=" + (timeI*delta).toFixed(3) + " J_l=" + ((phi[timeI][N-2] - 2*phi[timeI][N-1] + phi[timeI][N])/epsilon/epsilon/phi[timeI][N-1]).toFixed(3)  + "</text>");
  for(i=0; i<=10; i++){
    $("#svg").append("<polyline stroke-width='0.5' stroke='#000' points='100," + calcY(i/10) + " 1000," + calcY(i/10) + "' fill='none'/>");
    $("#svg").append("<text x='50' y='" + calcY(i/10) + "'>" + (i/10).toFixed(2) + "</text>");
    $("#svg").append("<polyline stroke-width='0.5' stroke='#000' points='" + (100 + i * 90) + ",50 " + (100 + i * 90) + ",650' fill='none'/>");
    $("#svg").append("<text x='" + (50 + i * 90) + "' y='670'>" + (i/10 * N * epsilon).toFixed(2) + "</text>");
  }
  var thetaString = "";
  var phiString = "";
  var jString = "";
  var rootString = "";
  for (var i = 0; i <= N; i++) {
    rootString += (" " + (i * 900 / N + 100)  + "," + calcY(nu*Math.exp(-i*epsilon/lambda_r)));
  }
  rootString = rootString.slice(1);
  for (var i = 1; i < N; i++) {
    let j = (phi[timeI][i-1] - 2*phi[timeI][i] + phi[timeI][i+1]) / phi[timeI][i]/epsilon/epsilon;
    jString += (" " + (i * 900 / N + 100)  + "," + calcY(j));
  }
  jString = jString.slice(1)
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
  $("#svg").append("<polyline stroke-width='2' stroke='#f00' points='" + rootString + "' fill='none'/>");
  $("#svg").append("<polyline stroke-width='2' stroke='#ff0' points='" + jString + "' fill='none'/>");

  $("#svg").html( $("#svg").html() );
  $("#time-range").val(timeI);
  timeI++;
  timeI = timeI % M;
}

function calcY(num){
  return 650 - 600 * num;
}