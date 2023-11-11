var phi = [];
var Theta = [];
var N = 1;
var M = 1;
var delta = 0.01;
var epsilon = 0.01;
var isShowing = false;
var intervalID = null;

window.onload = function(){
  calcOptionalVariable();
}

function calcOptionalVariable(){
  N = Number($("#N").val());
  M = Number($("#M").val());
  delta = Number($("#delta").val());
  epsilon = Number($("#epsilon").val());
  const j_0_const = Number($("#j_0").val());
  const lambda_r = Number($("#lambda_r").val());
  const nu = Number($("#nu").val());
  const j_l_const = j_0_const - nu*lambda_r*(1.0 - Math.exp(-N*epsilon / lambda_r));
  $("#Jl_const").text(j_l_const);
  $("#lambda-span").text((N*epsilon));
}

function calc() {
  $("#svg").html("");
  stop();
  isShowing = false;
  $("#show-btn").attr("style", "display:none;");
  N = Number($("#N").val());
  M = Number($("#M").val());
  delta = Number($("#delta").val());
  epsilon = Number($("#epsilon").val());
  const lambda_r = Number($("#lambda_r").val());
  const nu = Number($("#nu").val());
  const j_0_const = Number($("#j_0").val());
  const lambda = N*epsilon;
  const j_l_const = j_0_const - nu*lambda_r*(1.0 - Math.exp(-lambda/lambda_r));
  const sin_0 = Number($("#sin_0").val());
  const cos_0 = Number($("#cos_0").val());
  const sin_l = Number($("#sin_l").val());
  const cos_l = Number($("#cos_l").val());
  const T = Number($("#T").val());
  var J0 = [];
  var Jl = []
  for (let j = 0; j <=M; j++) {
    J0.push(j_0_const + sin_0* Math.sin(j * delta / T * 2 * Math.PI) + cos_0* Math.cos(j * delta / T * 2 * Math.PI));
    Jl.push(j_l_const + sin_l* Math.sin(j * delta / T * 2 * Math.PI) + cos_l* Math.cos(j * delta / T * 2 * Math.PI));
  }
  Theta = [[]]
  phi = [[1.0]]
  const c = Math.sqrt(J0[0]);
  const a = (6*c - 2*Math.sqrt(c*c - nu*lambda_r*(1 - Math.exp(-lambda/lambda_r)))) /lambda/lambda/lambda;
  for (let i = 0; i < N; i++) {
    Theta[0].push( a/3*i*epsilon*i*epsilon*i*epsilon - a*lambda/2*i*epsilon*i*epsilon + c );
    phi[0].push(phi[0][i] * (1.0 - epsilon*Theta[0][i]));
  }
  for(let j=0; j<M; j++){
    $("#status").text((j+1) + "/" + M);
    phi.push([0.0]);
    Theta.push([]);
    var exp = 1.0;
    for(let i=1; i<N; i++){
      phi[j+1].push(phi[j][i] + delta * ( ( phi[j][i-1] - 2 * phi[j][i] + phi[j][i+1] )/epsilon/epsilon + phi[j][i] * (nu * lambda_r *(1 - exp) - j_0_const) ));
      exp *= (1.0 - epsilon / lambda_r);
    }
    phi[j+1][0] = (2 + epsilon*epsilon * J0[j+1]) * phi[j+1][1] - phi[j+1][2];
    phi[j+1].push( (2 + epsilon*epsilon * Jl[j+1]) * phi[j+1][N-1] - phi[j+1][N-2] );
    for(let i=0; i<N; i++){
      Theta[j+1].push( (phi[j+1][i] - phi[j+1][i+1]) / epsilon / phi[j+1][i] );
    }
  }
  $("#status").text("");
  $("#show-btn").attr("style", "display:inline-block;");
  show();
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