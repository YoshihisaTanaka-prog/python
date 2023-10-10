import math

from matplotlib import animation
from matplotlib import pyplot as plt

delta = 0.005
epsilon = 0.1
N = 700
M = 10000
T = M * delta / 10
lambda_r = 1.0
Theta = []
zeta = []
nu = 0.1
J = []
J0_constant = 0.25
for i in range(N+1):
  Theta.append(0.5)
  zeta.append(i*epsilon)

for i in range(M):
  j = math.sin(i * delta / T * 2 * math.pi) / 2- math.cos(i * delta / T * 2 * math.pi) / 2
  J.append(j + J0_constant)

phi = []

exp = 1
phi.append([1.0])
zeta_theta = []
for i in range(1,N+1):
  phi[0].append(phi[0][i-1]/(epsilon * Theta[i] + 1.0))
  zeta_theta.append(i*epsilon)
J.append( (phi[0][0] - 2* phi[0][1] + phi[0][2]) / epsilon/epsilon / phi[0][1] )

fig = plt.figure()
ax = fig.add_subplot(111)
images = []
for j in range(1,M+1):
  phi.append([1.0])
  exp = 1.0
  for i in range(1,N):
    phi[j].append( phi[j-1][i] + delta * ( (phi[j-1][i-1] - 2* phi[j-1][i] + phi[j-1][i+1]) / epsilon/epsilon + phi[j-1][i] * nu * lambda_r *(1 - exp - J0_constant) ) )
    exp *= (1.0 - epsilon / lambda_r)
  phi[j].append(phi[j][N-1] * phi[j-1][N] / phi[j-1][N-1])
  phi[j][0] = (2 + epsilon*epsilon * J[j]) * phi[j][1] - phi[j][2]
  Theta = []
  for i in range(N):
    Theta.append( (phi[j][i] - phi[j][i+1]) / epsilon / phi[j][i] )
  img2 = plt.plot(zeta_theta, Theta,c="#0000ff")
  images.append(img2)
ani = animation.ArtistAnimation(fig, images, interval=20)
plt.show()