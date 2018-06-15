"Plot a PNG using matplotlib in a web request, using Flask."

# Install dependencies, preferably in a virtualenv:
#
#     pip install flask matplotlib
#
# Run the server:
#
#     python server.py
#
# Go to http://localhost:5000/plot.png and see a plot.

from io import BytesIO
from flask import Flask, make_response
app = Flask(__name__)

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

@app.route('/plot.png')
def plot():

    xs = [1,3]
    ys = [1,3]
    plt.plot(xs, ys)
    
    output = BytesIO()
    plt.savefig(output,transparent=True)
    response = make_response(output.getvalue())
    response.mimetype = 'image/png'
    return response

if __name__ == '__main__':
    app.run(debug=True)