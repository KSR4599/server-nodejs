import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import time

start = time.time()
xs = [1,3]
ys = [1,3]
plt.plot(xs, ys)

output = "a.png"
plt.savefig(output,transparent=True)
end = time.time()
print end - start
#plt.show()