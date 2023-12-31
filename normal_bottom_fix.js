function calc() {
  $("#svg").html("");
  if(intervalID != null){
    clearInterval(intervalID);
  }
  isShowing = false;
  $("#show-btn").attr("style", "display:none;");
  N = Number($("#N").val());
  M = Number($("#M").val());
  delta = Number($("#delta").val());
  epsilon = Number($("#epsilon").val());
  lambda_r = Number($("#lambda_r").val());
  nu = Number($("#nu").val());
  const lambda = N*epsilon;
  const j_l_const = Number($("#j_l").val());
  const j_0_const = j_l_const + nu*lambda_r*(1-Math.exp(-lambda/lambda_r));
  const sin = Number($("#sin_0").val());
  const cos = Number($("#cos_0").val());
  const T = Number($("#T").val());
  var J0 = [];
  for (let j = 0; j <=M; j++) {
    J0.push(j_0_const + sin* Math.sin(j * delta / T * 2 * Math.PI) + cos* Math.cos(j * delta / T * 2 * Math.PI));
  }
  // Theta = [[]];
  // phi = [[1.0]];
  // const c = Math.sqrt(J0[0]);
  // const a = (6*c - 2*Math.sqrt(c*c - nu*lambda_r*(1 - Math.exp(-lambda/lambda_r)))) /lambda/lambda/lambda;
  // for (let i = 0; i < N; i++) {
  //   Theta[0].push( a/3*i*epsilon*i*epsilon*i*epsilon - a*lambda/2*i*epsilon*i*epsilon + c );
  //   phi[0].push(phi[0][i] * (1.0 - epsilon*Theta[0][i]));
  // }
  initializePhiTheta(j_0_const,nu,lambda_r);
  for(let j=1; j<=M; j++){
    $("#status").text(j + "/" + M);
    phi.push([0.0]);
    Theta.push([]);
    for(let i=1; i<N; i++){
      phi[j].push(phi[j-1][i] + delta * ( ( phi[j-1][i-1] - 2 * phi[j-1][i] + phi[j-1][i+1] )/epsilon/epsilon + phi[j-1][i] *(nu * lambda_r *(1 - Math.exp(-i*epsilon/lambda_r)) - j_0_const) ));
    }
    phi[j][0] = (2 + epsilon*epsilon * J0[j]) * phi[j][1] - phi[j][2];
    phi[j].push(phi[j][N-1] * phi[j-1][N] / phi[j-1][N-1]);
    for(let i=0; i<N; i++){
      Theta[j].push( (phi[j][i] - phi[j][i+1]) / epsilon / phi[j][i] );
    }
  }
  $("#status").text("");
  $("#show-btn").attr("style", "display:inline-block;");
  show();
}