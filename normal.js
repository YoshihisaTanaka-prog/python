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
  const lambda = N*epsilon;
  const j_l_const = Number($("#j_l").val());
  const j_0_const = j_l_const + nu*lambda_r*(1-Math.exp(-lambda/lambda_r));
  const sin_0 = Number($("#sin_0").val());
  const cos_0 = Number($("#cos_0").val());
  const sin_l = Number($("#sin_l").val());
  const cos_l = Number($("#cos_l").val());
  const T = Number($("#T").val());
  var J0 = [];
  var Jl = [];
  for (let j = 0; j <=M; j++) {
    J0.push(j_0_const + sin_0* Math.sin(j * delta / T * 2 * Math.PI) + cos_0* Math.cos(j * delta / T * 2 * Math.PI));
    Jl.push(j_l_const + sin_l* Math.sin(j * delta / T * 2 * Math.PI) + cos_l* Math.cos(j * delta / T * 2 * Math.PI));
  }
  initializePhiTheta(j_0_const, nu, lambda_r);
  // const c = Math.sqrt(J0[0]);
  // const a = (6*c - 2*Math.sqrt(c*c - nu*lambda_r*(1 - Math.exp(-lambda/lambda_r)))) /lambda/lambda/lambda;
  // for (let i = 0; i < N; i++) {
  //   Theta[0].push( a/3*i*epsilon*i*epsilon*i*epsilon - a*lambda/2*i*epsilon*i*epsilon + c );
  //   phi[0].push(phi[0][i] * (1.0 - epsilon*Theta[0][i]));
  // }
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