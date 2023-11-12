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
  }
  $("#status").text("");
  $("#show-btn").attr("style", "display:inline-block;");
  show();
}