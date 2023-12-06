function calc() {
  $("#svg").html("");
  stop();
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
  for(let j=0; j<M; j++){
    $("#status").text((j+1) + "/" + M);
    var A = [];
    var b = [];
    A.push([0.0, 0.0, 1.0, -epsilon*epsilon*J0[j]-2, 1.0]);
    b.push(0);
    for (let i = 1; i < N; i++) {
      A.push([0.0, -delta/epsilon/epsilon, delta*2/epsilon/epsilon - delta*(nu*lambda_r*(1 - Math.exp(-i*epsilon/lambda_r)) - j_0_const) + 2, -delta/epsilon/epsilon, 0.0]);
      b.push((phi[j][i-1]/epsilon/epsilon + (-2.0/epsilon/epsilon + nu*lambda_r*(1 - Math.exp(-i*epsilon/lambda_r)) - j_0_const) * phi[j][i] + phi[j][i+1]/epsilon/epsilon)*delta + 2*phi[j][i]);
    }
    A.push([1.0, -2-epsilon*epsilon*Jl[j], 1.0, 0.0, 0.0]);
    b.push(0);
    for(let i=0; i<N-1; i++) {
      var k = A[i+1][1] / A[i][2];
      A[i+1][1] = A[i+1][1] - k*A[i][2];
      A[i+1][2] = A[i+1][2] - k*A[i][3];
      A[i+1][3] = A[i+1][3] - k*A[i][4];
      b[i+1] = b[i+1] - k*b[i];
      k = A[i+2][0] / A[i][2];
      A[i+2][0] = A[i+2][0] - k*A[i][2];
      A[i+2][1] = A[i+2][1] - k*A[i][3];
      A[i+2][2] = A[i+2][2] - k*A[i][4];
      b[i+2] = b[i+2] - k*b[i];
    }
    for (let i=N-1; i<N; i++) {
      var k = A[i+1][1] / A[i][2];
      A[i+1][1] = A[i+1][1] - k*A[i][2];
      A[i+1][2] = A[i+1][2] - k*A[i][3];
      A[i+1][3] = A[i+1][3] - k*A[i][4];
      b[i+1] = b[i+1] - k*b[i];
    }
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