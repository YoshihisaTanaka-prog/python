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
  const sin = Number($("#sin_0").val());
  const cos = Number($("#cos_0").val());
  const T = Number($("#T").val());
  var J0 = [];
  for (let j = 0; j <=M; j++) {
    J0.push(j_0_const + sin* Math.sin(j * delta / T * 2 * Math.PI) + cos* Math.cos(j * delta / T * 2 * Math.PI));
  }
  Theta = [[]]
  phi = [[1.0]]
  for (let i = 0; i < N; i++) {
    Theta[0].push(Math.sqrt(J0[0]));
    phi[0].push(phi[0][i] * (1 - epsilon*Theta[0][i]));
  }
  for(let j=0; j<M; j++){
    $("#status").text((j+1) + "/" + M);
    var A = [];
    var b = [];
    A.push([0.0, 0.0, 1.0, -epsilon*epsilon*J0[j]-2, 1.0]);
    b.push(0);
    var exp = 1.0
    for (let i = 1; i < N; i++) {
      A.push([0.0, -delta/epsilon/epsilon, delta*2/epsilon/epsilon - delta*(nu*lambda_r*(1 - exp) - j_0_const) + 2, -delta/epsilon/epsilon, 0.0]);
      b.push((phi[j][i-1]/epsilon/epsilon + (-2.0/epsilon/epsilon + nu*lambda_r*(1 - exp) - j_0_const) * phi[j][i] + phi[j][i+1]/epsilon/epsilon)*delta + 2*phi[j][i]);
      exp *= (1 - epsilon/lambda_r)
    }
    A.push([0.0, phi[j][N], -phi[j][N-1], 0.0, 0.0]);
    b.push(0);
    // writeA(A, "a-first");
    // writeB(b, "b-first");
    for(let i=0; i<N; i++) {
      let k = A[i+1][1] / A[i][2];
      A[i+1][1] = A[i+1][1] - k*A[i][2];
      A[i+1][2] = A[i+1][2] - k*A[i][3];
      A[i+1][3] = A[i+1][3] - k*A[i][4];
      b[i+1] = b[i+1] - k*b[i];
    }
    // writeA(A, "a-last");
    // writeB(b, "b-last");
    phi.push([b[N] / A[N][2]])
    for(let i=1; i<N; i++) {
      let ii = N-i;
      phi[j+1].unshift((b[ii] - A[ii][3]*phi[j+1][0]) / A[ii][2])
    }
    phi[j+1].unshift( (b[0] - A[0][3]* phi[j+1][0] - A[0][4]* phi[j+1][1] )/A[0][2]);
    Theta.push([])
    for(let i=0; i<N; i++){
      Theta[j+1].push( (phi[j+1][i] - phi[j+1][i+1]) / phi[j+1][i] / epsilon)
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

function writeA(A,id){
  $("#" + id).html("");
  var i = 0;
  for (const a of A) {
    $("#" + id).append("<tr id='" + id + "-" + i + "'></tr>");
    for(let j=0; j<i; j++){
      $("#" + id + "-" + i).append("<td>0</td>");
    }
    for (const ai of a) {
      $("#" + id + "-" + i).append("<td>" + ai + "</td>");
    }
    for(let j=0; j<N-i; j++){
      $("#" + id + "-" + i).append("<td>0</td>");
    }
    console.log(i);
    i++;
  }
}

function writeB(b,id){
  $("#" + id).html("");
  for (const bi of b) {
    $("#" + id).append("<tr><td>" + bi + "</td></tr>")
  }
}