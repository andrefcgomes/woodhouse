from flask import Flask, render_template, jsonify, request
# from flask_socketio import SocketIO,send, emit
import sqlite3
import json


def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT'
        headers = request.headers.get('Access-Control-Request-Headers')
        if headers:
            response.headers['Access-Control-Allow-Headers'] = headers
    return response


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.after_request(add_cors_headers)

# socketio = SocketIO(app)
#
@app.route('/test')
def test():
    return "Hello World!"
#
# @app.route('/args', methods= ['POST'])
# def getEngineArgs():
#     engine = request.form['engine']
#     return jsonify(psatools.getEngineArgs(engine))
#
# @app.route('/launch', methods= ['POST'])
# def launch():
#     return jsonify(psatools.runPSA(request.form))
#
@app.route('/logs')
def listLogFiles():
    conn = sqlite3.connect('/common/bot.db')
    c = conn.cursor()
    # Insert a row of data
    data = []
    lines = c.execute("SELECT * FROM quotes ORDER BY id DESC ")
    for l in lines:
        data.append(l)
    # Save (commit) the changes
    conn.commit()
    # We can also close the connection if we are done with it.
    # Just be sure any changes have been committed or they will be lost.
    conn.close()
    print(data)
    return render_template('quotes.html', quotes=data)
    # return jsonify(psatools.listLogFiles())
#
# @app.route('/logs/<filename>')
# def viewLog(filename):
#     print(filename)
#     data = psatools.viewLogFile(filename)
#     # print(data)
#     for d in data:
#         print (d)
#     return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
